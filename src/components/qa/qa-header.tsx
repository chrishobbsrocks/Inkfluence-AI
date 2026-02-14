"use client";

import { AppHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { RefreshCw, Zap, Loader2 } from "lucide-react";

interface QAHeaderProps {
  isAnalyzing: boolean;
  isFixing: boolean;
  hasAnalysis: boolean;
  autoFixableCount: number;
  error: string | null;
  onRerun: () => void;
  onFixAll: () => void;
}

export function QAHeader({
  isAnalyzing,
  isFixing,
  hasAnalysis,
  autoFixableCount,
  error,
  onRerun,
  onFixAll,
}: QAHeaderProps) {
  return (
    <AppHeader title="Quality Review">
      {error && (
        <span className="text-[10px] text-red-500 mr-2">{error}</span>
      )}
      <Button
        variant="outline"
        size="sm"
        className="h-8 text-xs gap-1.5"
        onClick={onRerun}
        disabled={isAnalyzing}
      >
        {isAnalyzing ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <RefreshCw className="w-3 h-3" />
        )}
        {hasAnalysis ? "Re-run" : "Run Analysis"}
      </Button>
      {hasAnalysis && (
        <Button
          size="sm"
          className="h-8 text-xs bg-stone-900 hover:bg-stone-800 gap-1.5"
          onClick={onFixAll}
          disabled={isAnalyzing || isFixing || autoFixableCount === 0}
        >
          {isFixing ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Zap className="w-3 h-3" />
          )}
          Fix All Issues
        </Button>
      )}
    </AppHeader>
  );
}
