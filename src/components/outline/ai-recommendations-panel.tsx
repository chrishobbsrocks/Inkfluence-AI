"use client";

import { Sparkles, Plus, X, RefreshCw, CheckCircle2, AlertCircle, Circle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { OutlineSuggestion, CoverageItem, AnalysisStatus } from "@/types/outline-analysis";

interface AiRecommendationsPanelProps {
  suggestions: OutlineSuggestion[];
  coverage: CoverageItem[];
  overallScore: number;
  summary: string;
  status: AnalysisStatus;
  error: string | null;
  onAddSuggestion: (suggestion: OutlineSuggestion) => void;
  onDismiss: (id: string) => void;
  onRefresh: () => void;
}

function CoverageIcon({ coverageStatus }: { coverageStatus: CoverageItem["status"] }) {
  if (coverageStatus === "well-covered") {
    return <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />;
  }
  if (coverageStatus === "partial") {
    return <AlertCircle className="w-3 h-3 text-amber-500 shrink-0" />;
  }
  return <Circle className="w-3 h-3 text-stone-300 shrink-0" />;
}

function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-600";
  return "text-red-600";
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3 animate-pulse" data-testid="analysis-loading">
      <div className="h-3 bg-stone-200 rounded w-3/4" />
      <div className="h-3 bg-stone-200 rounded w-1/2" />
      <div className="space-y-2 mt-4">
        <div className="h-16 bg-stone-100 rounded" />
        <div className="h-16 bg-stone-100 rounded" />
      </div>
      <div className="space-y-1.5 mt-4">
        <div className="h-4 bg-stone-100 rounded w-2/3" />
        <div className="h-4 bg-stone-100 rounded w-1/2" />
        <div className="h-4 bg-stone-100 rounded w-3/4" />
      </div>
    </div>
  );
}

export function AiRecommendationsPanel({
  suggestions,
  coverage,
  overallScore,
  summary,
  status,
  error,
  onAddSuggestion,
  onDismiss,
  onRefresh,
}: AiRecommendationsPanelProps) {
  return (
    <Card className="border-stone-200 h-fit">
      <CardHeader className="p-3.5 pb-2 bg-stone-50 rounded-t-lg border-b border-stone-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-stone-500" />
            <span className="text-xs font-semibold text-stone-700">
              AI Recommendations
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={onRefresh}
            disabled={status === "loading"}
            aria-label="Refresh analysis"
          >
            <RefreshCw
              className={`w-3 h-3 text-stone-400 ${
                status === "loading" ? "animate-spin" : ""
              }`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-3.5">
        {status === "loading" && !suggestions.length ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="text-center py-3" data-testid="analysis-error">
            <p className="text-xs text-red-500 mb-2">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="h-6 text-[10px]"
              onClick={onRefresh}
            >
              Retry
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Overall Score */}
            <div className="flex items-baseline justify-between">
              <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
                Completeness
              </span>
              <span
                className={`text-sm font-bold ${scoreColor(overallScore)}`}
              >
                {overallScore}%
              </span>
            </div>

            {/* Summary */}
            {summary && (
              <p className="text-[11px] text-stone-500 leading-relaxed">
                {summary}
              </p>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                  Suggested chapters
                </p>
                <div className="space-y-2">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className={`p-2 rounded-md border ${
                        suggestion.priority === "high"
                          ? "bg-amber-50 border-amber-100"
                          : "bg-stone-50 border-stone-100"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <p className="text-xs font-medium text-stone-700">
                          {suggestion.chapterTitle}
                        </p>
                        <div className="flex gap-0.5 shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0"
                            onClick={() => onAddSuggestion(suggestion)}
                            aria-label={`Add ${suggestion.chapterTitle}`}
                          >
                            <Plus className="w-3 h-3 text-emerald-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0"
                            onClick={() => onDismiss(suggestion.id)}
                            aria-label={`Dismiss ${suggestion.chapterTitle}`}
                          >
                            <X className="w-3 h-3 text-stone-400" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {suggestion.rationale}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Coverage */}
            {coverage.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                  Topic coverage
                </p>
                <div className="space-y-1">
                  {coverage.map((item) => (
                    <div
                      key={item.area}
                      className="flex items-center gap-1.5"
                    >
                      <CoverageIcon coverageStatus={item.status} />
                      <span className="text-[11px] text-stone-600">
                        {item.area}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {suggestions.length === 0 && (
              <p className="text-xs text-stone-400">
                No additional suggestions. Your outline looks comprehensive!
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
