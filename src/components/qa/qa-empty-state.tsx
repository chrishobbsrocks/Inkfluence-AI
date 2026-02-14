"use client";

import { Button } from "@/components/ui/button";
import { ClipboardCheck, Loader2 } from "lucide-react";

interface QAEmptyStateProps {
  isLoading: boolean;
  onRunAnalysis: () => void;
}

export function QAEmptyState({ isLoading, onRunAnalysis }: QAEmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="text-center space-y-3">
        <ClipboardCheck className="w-10 h-10 text-stone-300 mx-auto" />
        <h2 className="text-lg font-semibold text-stone-700">
          No Quality Analysis Yet
        </h2>
        <p className="text-sm text-stone-500 max-w-sm">
          Run your first analysis to get quality scores and improvement
          suggestions for your book.
        </p>
        <Button
          size="sm"
          className="h-8 text-xs bg-stone-900 hover:bg-stone-800"
          onClick={onRunAnalysis}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-3 h-3 animate-spin mr-1.5" />
          ) : null}
          Run Analysis
        </Button>
      </div>
    </div>
  );
}
