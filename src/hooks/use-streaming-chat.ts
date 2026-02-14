"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import { stripStructuredTags } from "@/lib/ai/response-parser";
import type {
  ConversationMessage,
  WizardState,
  StreamMetadata,
} from "@/types/wizard";

interface UseStreamingChatOptions {
  outlineId: string;
  initialMessages: ConversationMessage[];
  initialWizardState: WizardState | null;
}

interface UseStreamingChatReturn {
  messages: ConversationMessage[];
  wizardState: WizardState | null;
  streamingText: string;
  isStreaming: boolean;
  error: string | null;
  sendMessage: (message: string) => void;
  clearError: () => void;
}

interface SSEEvent {
  type: "text" | "metadata" | "save_status" | "done" | "error";
  content: string;
}

export function useStreamingChat({
  outlineId,
  initialMessages,
  initialWizardState,
}: UseStreamingChatOptions): UseStreamingChatReturn {
  const [messages, setMessages] =
    useState<ConversationMessage[]>(initialMessages);
  const [wizardState, setWizardState] = useState<WizardState | null>(
    initialWizardState
  );
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const sendMessage = useCallback(
    async (message: string) => {
      // Abort any in-flight request
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      // Add user message immediately
      const userMsg: ConversationMessage = { role: "user", content: message };
      setMessages((prev) => [...prev, userMsg]);
      setStreamingText("");
      setIsStreaming(true);
      setError(null);

      let fullText = "";

      try {
        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ outlineId, message }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorBody = await response.json().catch(() => null);
          throw new Error(
            (errorBody as { error?: string })?.error ?? `HTTP ${response.status}`
          );
        }

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Process complete SSE events (separated by \n\n)
          const events = buffer.split("\n\n");
          buffer = events.pop() ?? "";

          for (const event of events) {
            const line = event.trim();
            if (!line.startsWith("data: ")) continue;

            let parsed: SSEEvent;
            try {
              parsed = JSON.parse(line.slice(6)) as SSEEvent;
            } catch {
              continue;
            }

            switch (parsed.type) {
              case "text":
                fullText += parsed.content;
                setStreamingText(stripStructuredTags(fullText));
                break;

              case "metadata": {
                const metadata = JSON.parse(parsed.content) as StreamMetadata;
                setWizardState(metadata.wizardState);
                break;
              }

              case "save_status": {
                const saveStatus = JSON.parse(parsed.content) as {
                  success: boolean;
                  error?: string;
                };
                if (!saveStatus.success) {
                  toast.error("Conversation not saved", {
                    description: "Your latest exchange may be lost if you leave this page.",
                    duration: 8000,
                  });
                }
                break;
              }

              case "done": {
                const cleanText = stripStructuredTags(fullText);
                setMessages((prev) => [
                  ...prev,
                  { role: "assistant", content: cleanText },
                ]);
                setStreamingText("");
                setIsStreaming(false);
                break;
              }

              case "error":
                setError(parsed.content);
                setIsStreaming(false);
                break;
            }
          }
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError(
          err instanceof Error ? err.message : "Failed to send message"
        );
        setIsStreaming(false);
      }
    },
    [outlineId]
  );

  const clearError = useCallback(() => setError(null), []);

  return {
    messages,
    wizardState,
    streamingText,
    isStreaming,
    error,
    sendMessage,
    clearError,
  };
}
