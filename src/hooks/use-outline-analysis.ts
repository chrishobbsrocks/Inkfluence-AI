"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type {
  OutlineAnalysis,
  OutlineSuggestion,
  AnalysisStatus,
} from "@/types/outline-analysis";

interface UseOutlineAnalysisOptions {
  outlineId: string;
  sectionCount: number;
}

interface UseOutlineAnalysisResult {
  analysis: OutlineAnalysis | null;
  status: AnalysisStatus;
  error: string | null;
  dismissedIds: Set<string>;
  dismissSuggestion: (id: string) => void;
  visibleSuggestions: OutlineSuggestion[];
  refresh: () => void;
}

async function fetchAnalysis(
  outlineId: string,
  signal: AbortSignal
): Promise<OutlineAnalysis> {
  const response = await fetch("/api/outline/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ outlineId }),
    signal,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(
      (data as { error?: string }).error ?? `Analysis failed (${response.status})`
    );
  }

  return response.json() as Promise<OutlineAnalysis>;
}

export function useOutlineAnalysis({
  outlineId,
  sectionCount,
}: UseOutlineAnalysisOptions): UseOutlineAnalysisResult {
  const [analysis, setAnalysis] = useState<OutlineAnalysis | null>(null);
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevSectionCountRef = useRef(sectionCount);
  const isInitialFetchDone = useRef(false);

  const runAnalysis = useCallback(() => {
    // Cancel any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus("loading");
    setError(null);

    fetchAnalysis(outlineId, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) {
          setAnalysis(result);
          setStatus("success");
          isInitialFetchDone.current = true;
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error ? err.message : "Analysis failed"
          );
          setStatus("error");
        }
      });
  }, [outlineId]);

  // Initial fetch on mount
  useEffect(() => {
    runAnalysis();

    return () => {
      abortRef.current?.abort();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [runAnalysis]);

  // Debounced re-analysis when section count changes
  useEffect(() => {
    if (!isInitialFetchDone.current) return;
    if (sectionCount === prevSectionCountRef.current) return;

    prevSectionCountRef.current = sectionCount;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      runAnalysis();
    }, 3000);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [sectionCount, runAnalysis]);

  const dismissSuggestion = useCallback((id: string) => {
    setDismissedIds((prev) => new Set(prev).add(id));
  }, []);

  const visibleSuggestions = (analysis?.suggestions ?? []).filter(
    (s) => !dismissedIds.has(s.id)
  );

  const refresh = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    runAnalysis();
  }, [runAnalysis]);

  return {
    analysis,
    status,
    error,
    dismissedIds,
    dismissSuggestion,
    visibleSuggestions,
    refresh,
  };
}
