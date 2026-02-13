"use client";

import { Sparkles } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import type { GapSuggestion } from "@/types/wizard";

interface AiRecommendationsPanelProps {
  gaps: GapSuggestion[];
}

export function AiRecommendationsPanel({
  gaps,
}: AiRecommendationsPanelProps) {
  const highPriority = gaps.filter((g) => g.importance === "high");
  const otherGaps = gaps.filter((g) => g.importance !== "high");

  return (
    <Card className="border-stone-200 h-fit">
      <CardHeader className="p-3.5 pb-2 bg-stone-50 rounded-t-lg border-b border-stone-100">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-stone-500" />
          <span className="text-xs font-semibold text-stone-700">
            AI Recommendations
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-3.5">
        {gaps.length === 0 ? (
          <p className="text-xs text-stone-400">
            No additional recommendations at this time.
          </p>
        ) : (
          <div className="space-y-3">
            {highPriority.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                  Suggested additions
                </p>
                <div className="space-y-2">
                  {highPriority.map((gap, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-md bg-amber-50 border border-amber-100"
                    >
                      <p className="text-xs font-medium text-stone-700">
                        {gap.area}
                      </p>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {gap.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {otherGaps.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                  Consider adding
                </p>
                <div className="space-y-1.5">
                  {otherGaps.map((gap, i) => (
                    <div key={i} className="p-2 rounded-md bg-stone-50">
                      <p className="text-xs font-medium text-stone-600">
                        {gap.area}
                      </p>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        {gap.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
