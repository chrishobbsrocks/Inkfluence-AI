"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QASuggestionItem } from "./qa-suggestion-item";
import type { QASuggestion } from "@/types/qa-analysis";

interface QASuggestionsCardProps {
  suggestions: QASuggestion[];
  selectedChapterId: string | null;
  fixingIds: Set<string>;
  fixedIds: Set<string>;
  onFix: (suggestion: QASuggestion) => void;
}

export function QASuggestionsCard({
  suggestions,
  selectedChapterId,
  fixingIds,
  fixedIds,
  onFix,
}: QASuggestionsCardProps) {
  const filtered = selectedChapterId
    ? suggestions.filter((s) => s.chapterId === selectedChapterId)
    : suggestions;

  return (
    <Card className="border-stone-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-stone-600">
            {selectedChapterId ? "Chapter Suggestions" : "Top Suggestions"}
          </span>
          <Badge variant="secondary" className="text-[9px]">
            {filtered.length}
          </Badge>
        </div>
        {filtered.length === 0 ? (
          <div className="text-sm text-stone-400 py-4 text-center">
            No suggestions{selectedChapterId ? " for this chapter" : ""}.
          </div>
        ) : (
          filtered.map((suggestion) => (
            <QASuggestionItem
              key={suggestion.id}
              suggestion={suggestion}
              isFixing={fixingIds.has(suggestion.id)}
              isFixed={fixedIds.has(suggestion.id)}
              onFix={onFix}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}
