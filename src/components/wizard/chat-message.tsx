"use client";

import { Sparkles } from "lucide-react";
import { formatChatContent } from "@/lib/format-chat-content";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  userInitial?: string;
}

export function ChatMessage({
  role,
  content,
  userInitial = "U",
}: ChatMessageProps) {
  const isAI = role === "assistant";

  return (
    <div
      className={`flex gap-3 ${isAI ? "" : "flex-row-reverse"}`}
    >
      {/* Avatar */}
      {isAI ? (
        <div className="w-7 h-7 rounded-full bg-stone-900 flex items-center justify-center shrink-0">
          <Sparkles className="w-3 h-3 text-white" />
        </div>
      ) : (
        <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center shrink-0">
          <span className="font-bold text-[10px] text-stone-600">
            {userInitial}
          </span>
        </div>
      )}

      {/* Message bubble */}
      <div
        className={`max-w-md px-4 py-3 text-[13px] leading-relaxed rounded-xl ${
          isAI
            ? "bg-white border border-stone-200 rounded-tl-sm text-stone-600"
            : "bg-stone-100 rounded-tr-sm text-stone-700"
        }`}
      >
        {formatChatContent(content)}
      </div>
    </div>
  );
}
