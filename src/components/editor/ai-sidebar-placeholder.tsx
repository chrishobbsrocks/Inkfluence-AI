"use client";

import { Sparkles } from "lucide-react";

export function AiSidebarPlaceholder() {
  return (
    <div className="w-64 border-l border-stone-200 bg-stone-50/50 p-4 shrink-0">
      <div className="flex items-center gap-1.5 mb-3">
        <Sparkles className="w-3.5 h-3.5 text-stone-400" />
        <span className="text-xs font-semibold text-stone-500">
          AI Assistant
        </span>
      </div>
      <p className="text-xs text-stone-400">
        AI writing assistance will be available here in a future update.
      </p>
    </div>
  );
}
