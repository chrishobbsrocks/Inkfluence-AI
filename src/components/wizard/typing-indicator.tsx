"use client";

import { Sparkles } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-7 h-7 rounded-full bg-stone-900 flex items-center justify-center shrink-0">
        <Sparkles className="w-3 h-3 text-white" />
      </div>
      <div className="bg-white border border-stone-200 rounded-xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-pulse" />
        <span
          className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-pulse"
          style={{ animationDelay: "0.2s" }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-pulse"
          style={{ animationDelay: "0.4s" }}
        />
      </div>
    </div>
  );
}
