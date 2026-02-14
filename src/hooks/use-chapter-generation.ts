"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import type {
  GenerationStatus,
  GenerationTone,
  GenerationExpertise,
  GenerationSSEEvent,
  GenerationMetadata,
  SaveStatusPayload,
} from "@/types/chapter-generation";

interface UseChapterGenerationOptions {
  chapterId: string;
  bookId: string;
}

interface UseChapterGenerationReturn {
  status: GenerationStatus;
  streamedContent: string;
  error: string | null;
  wordCount: number;
  generate: (tone: GenerationTone, expertise: GenerationExpertise) => void;
  abort: () => void;
}

export function useChapterGeneration({
  chapterId,
  bookId,
}: UseChapterGenerationOptions): UseChapterGenerationReturn {
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [streamedContent, setStreamedContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);

  const abortRef = useRef<AbortController | null>(null);
  const rafRef = useRef<number | null>(null);
  const pendingContentRef = useRef<string>("");
  const lastUpdateRef = useRef<number>(0);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Throttled content update (~100ms)
  const scheduleContentUpdate = useCallback(() => {
    const now = Date.now();
    if (now - lastUpdateRef.current >= 100) {
      lastUpdateRef.current = now;
      setStreamedContent(pendingContentRef.current);
    } else if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        lastUpdateRef.current = Date.now();
        setStreamedContent(pendingContentRef.current);
      });
    }
  }, []);

  const abort = useCallback(() => {
    abortRef.current?.abort();
    setStatus("idle");
  }, []);

  const generate = useCallback(
    async (tone: GenerationTone, expertise: GenerationExpertise) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      pendingContentRef.current = "";
      lastUpdateRef.current = 0;
      setStreamedContent("");
      setStatus("loading");
      setError(null);
      setWordCount(0);

      try {
        const response = await fetch("/api/ai/generate/chapter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chapterId, bookId, tone, expertise }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({}));
          throw new Error(
            (errorBody as { error?: string }).error ??
              `Generation failed (${response.status})`
          );
        }

        setStatus("streaming");
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split("\n\n");
          buffer = events.pop() ?? "";

          for (const event of events) {
            const line = event.trim();
            if (!line.startsWith("data: ")) continue;

            let parsed: GenerationSSEEvent;
            try {
              parsed = JSON.parse(line.slice(6)) as GenerationSSEEvent;
            } catch {
              continue;
            }

            switch (parsed.type) {
              case "text":
                pendingContentRef.current += parsed.content;
                scheduleContentUpdate();
                break;
              case "metadata": {
                const metadata = JSON.parse(
                  parsed.content
                ) as GenerationMetadata;
                setWordCount(metadata.wordCount);
                break;
              }
              case "save_status": {
                const saveStatus = JSON.parse(
                  parsed.content
                ) as SaveStatusPayload;
                if (!saveStatus.success) {
                  toast.error("Content generated but not saved", {
                    description: "Your content may be lost. Copy it manually before leaving this page.",
                    duration: 10000,
                  });
                }
                break;
              }
              case "done":
                // Flush any pending content
                setStreamedContent(pendingContentRef.current);
                setStatus("complete");
                break;
              case "error":
                setError(parsed.content);
                setStatus("error");
                break;
            }
          }
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Generation failed");
        setStatus("error");
      }
    },
    [chapterId, bookId, scheduleContentUpdate]
  );

  return { status, streamedContent, error, wordCount, generate, abort };
}
