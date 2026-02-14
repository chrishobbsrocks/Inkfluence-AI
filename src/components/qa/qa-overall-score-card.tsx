"use client";

import { Card, CardContent } from "@/components/ui/card";
import { QAScoreBadge } from "./qa-score-badge";
import { QADimensionScore } from "./qa-dimension-score";
import type { QualityLevel } from "@/types/qa-analysis";

interface QAOverallScoreCardProps {
  overallScore: number;
  qualityLevel: QualityLevel;
  summary: string;
  readability: number;
  consistency: number;
  structure: number;
  accuracy: number;
}

const QUALITY_LABELS: Record<QualityLevel, string> = {
  exceptional: "Exceptional Quality",
  professional: "Professional Quality",
  good: "Good Quality",
  "needs-improvement": "Needs Improvement",
  "needs-significant-work": "Needs Significant Work",
};

export function QAOverallScoreCard({
  overallScore,
  qualityLevel,
  summary,
  readability,
  consistency,
  structure,
  accuracy,
}: QAOverallScoreCardProps) {
  return (
    <Card className="border-stone-200 mb-5 text-center">
      <CardContent className="p-6">
        <div className="flex justify-center mb-2">
          <QAScoreBadge score={overallScore} size="lg" />
        </div>
        <div className="font-semibold text-stone-800">
          {QUALITY_LABELS[qualityLevel]}
        </div>
        <div className="text-[11px] text-stone-400 mb-4">{summary}</div>
        <div className="flex justify-center gap-8">
          <QADimensionScore label="Readability" score={readability} />
          <QADimensionScore label="Consistency" score={consistency} />
          <QADimensionScore label="Structure" score={structure} />
          <QADimensionScore label="Accuracy" score={accuracy} />
        </div>
      </CardContent>
    </Card>
  );
}
