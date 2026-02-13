"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./chat-message";
import { TypingIndicator } from "./typing-indicator";
import type { ConversationMessage } from "@/types/wizard";

interface ChatMessageListProps {
  messages: ConversationMessage[];
  streamingText: string;
  isStreaming: boolean;
  userInitial: string;
}

export function ChatMessageList({
  messages,
  streamingText,
  isStreaming,
  userInitial,
}: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or streaming text updates
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText, isStreaming]);

  return (
    <ScrollArea className="flex-1">
      <div className="max-w-xl mx-auto space-y-5 py-6 px-4">
        {messages.map((msg, i) => (
          <ChatMessage
            key={i}
            role={msg.role}
            content={msg.content}
            userInitial={userInitial}
          />
        ))}

        {/* Streaming response in progress */}
        {isStreaming && streamingText && (
          <ChatMessage
            role="assistant"
            content={streamingText}
            userInitial={userInitial}
          />
        )}

        {/* Typing indicator when streaming but no text yet */}
        {isStreaming && !streamingText && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
