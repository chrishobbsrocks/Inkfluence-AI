"use client";

import { useState, useMemo } from "react";
import { QAHeader } from "./qa-header";
import { QAEmptyState } from "./qa-empty-state";
import { QAOverallScoreCard } from "./qa-overall-score-card";
import { QAChapterScoresCard } from "./qa-chapter-scores-card";
import { QASuggestionsCard } from "./qa-suggestions-card";
import { useQAAnalysis } from "@/hooks/use-qa-analysis";
import type { QAAnalysisResult } from "@/types/qa-analysis";

interface QAWrapperProps {
  bookId: string;
  initialAnalysis: QAAnalysisResult | null;
}

export function QAWrapper({ bookId, initialAnalysis }: QAWrapperProps) {
  const {
    analysis,
    status,
    error,
    fixingIds,
    fixedIds,
    runAnalysis,
    fixSuggestion,
    fixAllAutoFixable,
  } = useQAAnalysis({ bookId, initialAnalysis });

  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(
    null
  );

  const isAnalyzing = status === "loading";
  const isFixing = fixingIds.size > 0;

  const autoFixableCount = useMemo(() => {
    if (!analysis) return 0;
    return analysis.suggestions.filter(
      (s) => s.autoFixable && s.suggestedFix && !fixedIds.has(s.id)
    ).length;
  }, [analysis, fixedIds]);

  return (
    <>
      <QAHeader
        isAnalyzing={isAnalyzing}
        isFixing={isFixing}
        hasAnalysis={!!analysis}
        autoFixableCount={autoFixableCount}
        error={error}
        onRerun={runAnalysis}
        onFixAll={fixAllAutoFixable}
      />
      {!analysis ? (
        <QAEmptyState isLoading={isAnalyzing} onRunAnalysis={runAnalysis} />
      ) : (
        <div className="flex-1 bg-stone-50/50 p-5 overflow-y-auto">
          <QAOverallScoreCard
            overallScore={analysis.overallScore}
            qualityLevel={analysis.qualityLevel}
            summary={analysis.summary}
            readability={analysis.readability}
            consistency={analysis.consistency}
            structure={analysis.structure}
            accuracy={analysis.accuracy}
          />
          <QAChapterScoresCard
            chapterScores={analysis.chapterScores}
            selectedChapterId={selectedChapterId}
            onSelectChapter={setSelectedChapterId}
          />
          <QASuggestionsCard
            suggestions={analysis.suggestions}
            selectedChapterId={selectedChapterId}
            fixingIds={fixingIds}
            fixedIds={fixedIds}
            onFix={fixSuggestion}
          />
        </div>
      )}
    </>
  );
}
