"use client";

import { useState, useCallback, useRef } from "react";
import type { QAAnalysisResult, QASuggestion } from "@/types/qa-analysis";

export type QAStatus = "idle" | "loading" | "error";

interface UseQAAnalysisOptions {
  bookId: string;
  initialAnalysis: QAAnalysisResult | null;
}

interface UseQAAnalysisReturn {
  analysis: QAAnalysisResult | null;
  status: QAStatus;
  error: string | null;
  fixingIds: Set<string>;
  fixedIds: Set<string>;
  runAnalysis: () => void;
  fixSuggestion: (suggestion: QASuggestion) => Promise<void>;
  fixAllAutoFixable: () => Promise<void>;
}

export function useQAAnalysis({
  bookId,
  initialAnalysis,
}: UseQAAnalysisOptions): UseQAAnalysisReturn {
  const [analysis, setAnalysis] = useState<QAAnalysisResult | null>(
    initialAnalysis
  );
  const [status, setStatus] = useState<QAStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fixingIds, setFixingIds] = useState<Set<string>>(new Set());
  const [fixedIds, setFixedIds] = useState<Set<string>>(new Set());
  const abortRef = useRef<AbortController | null>(null);

  const runAnalysis = useCallback(() => {
    // Abort any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus("loading");
    setError(null);

    fetch("/api/qa/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId }),
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(
            (data as { error?: string }).error ?? "Analysis failed"
          );
        }
        return res.json();
      })
      .then((data: QAAnalysisResult) => {
        if (!controller.signal.aborted) {
          setAnalysis(data);
          setStatus("idle");
          setFixedIds(new Set());
          setFixingIds(new Set());
        }
      })
      .catch((err: Error) => {
        if (err.name !== "AbortError") {
          setError(err.message);
          setStatus("error");
        }
      });
  }, [bookId]);

  const fixSuggestion = useCallback(
    async (suggestion: QASuggestion) => {
      if (!suggestion.autoFixable || !suggestion.suggestedFix) return;

      setFixingIds((prev) => new Set(prev).add(suggestion.id));

      try {
        const res = await fetch("/api/qa/fix", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookId,
            chapterId: suggestion.chapterId,
            suggestionId: suggestion.id,
            originalText: suggestion.issueText,
            suggestedFix: suggestion.suggestedFix,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(
            (data as { error?: string }).error ?? "Fix failed"
          );
        }

        setFixedIds((prev) => new Set(prev).add(suggestion.id));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Fix failed unexpectedly"
        );
      } finally {
        setFixingIds((prev) => {
          const next = new Set(prev);
          next.delete(suggestion.id);
          return next;
        });
      }
    },
    [bookId]
  );

  const fixAllAutoFixable = useCallback(async () => {
    if (!analysis) return;

    const fixable = analysis.suggestions.filter(
      (s) => s.autoFixable && s.suggestedFix && !fixedIds.has(s.id)
    );

    // Apply fixes sequentially to avoid race conditions on same chapter
    for (const suggestion of fixable) {
      await fixSuggestion(suggestion);
    }
  }, [analysis, fixedIds, fixSuggestion]);

  return {
    analysis,
    status,
    error,
    fixingIds,
    fixedIds,
    runAnalysis,
    fixSuggestion,
    fixAllAutoFixable,
  };
}
