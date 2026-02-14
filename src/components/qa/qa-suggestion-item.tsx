"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Wand2, Check } from "lucide-react";
import type { QASuggestion } from "@/types/qa-analysis";

interface QASuggestionItemProps {
  suggestion: QASuggestion;
  isFixing: boolean;
  isFixed: boolean;
  onFix: (suggestion: QASuggestion) => void;
}

const SEVERITY_STYLES: Record<string, string> = {
  critical: "bg-red-100 text-red-700",
  major: "bg-amber-100 text-amber-700",
  minor: "bg-stone-100 text-stone-600",
};

export function QASuggestionItem({
  suggestion,
  isFixing,
  isFixed,
  onFix,
}: QASuggestionItemProps) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-stone-100 last:border-0">
      <div
        className={`px-1.5 py-0.5 rounded text-[9px] font-medium flex-shrink-0 mt-0.5 ${SEVERITY_STYLES[suggestion.severity] ?? SEVERITY_STYLES.minor}`}
      >
        {suggestion.severity}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-stone-700">
          {suggestion.issueText}
        </div>
        <div className="text-[11px] text-stone-400">{suggestion.explanation}</div>
        {suggestion.chapterTitle && suggestion.chapterTitle !== "Cross-chapter" && (
          <div className="text-[10px] text-stone-400 mt-0.5">
            Ch. {suggestion.chapterTitle}
          </div>
        )}
      </div>
      {suggestion.autoFixable && suggestion.suggestedFix && (
        <div className="flex-shrink-0">
          {isFixed ? (
            <span className="inline-flex items-center gap-1 text-[10px] text-green-600 font-medium">
              <Check className="w-3 h-3" /> Fixed
            </span>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[10px]"
              onClick={() => onFix(suggestion)}
              disabled={isFixing}
            >
              {isFixing ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Wand2 className="w-3 h-3 mr-1" />
              )}
              Auto-fix
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
