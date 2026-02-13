"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatChatContent } from "@/lib/format-chat-content";

interface GapSuggestionMessageProps {
  content: string;
  gapArea: string;
  onAccept: () => void;
  onSkip: () => void;
  disabled?: boolean;
}

export function GapSuggestionMessage({
  content,
  gapArea,
  onAccept,
  onSkip,
  disabled = false,
}: GapSuggestionMessageProps) {
  return (
    <div className="flex gap-3">
      <div className="w-7 h-7 rounded-full bg-stone-900 flex items-center justify-center shrink-0">
        <Sparkles className="w-3 h-3 text-white" />
      </div>
      <div className="max-w-md">
        <div className="bg-white border border-stone-200 rounded-xl rounded-tl-sm px-4 py-3 text-[13px] leading-relaxed text-stone-600">
          {formatChatContent(content)}
        </div>
        <div className="flex gap-2 mt-2">
          <Button
            size="sm"
            className="h-7 text-[11px] bg-stone-900 hover:bg-stone-800"
            onClick={onAccept}
            disabled={disabled}
          >
            Yes, add it
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-[11px]"
            onClick={onSkip}
            disabled={disabled}
          >
            Skip {gapArea ? `"${gapArea}"` : "for now"}
          </Button>
        </div>
      </div>
    </div>
  );
}
