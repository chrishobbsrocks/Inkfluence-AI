"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Plus, ArrowRight, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AppHeader } from "@/components/app-shell";
import { convertOutlineToChaptersAction } from "@/server/actions/chapters";
import { resetOutlineForWizardAction } from "@/server/actions/outlines";

interface OutlineHeaderProps {
  bookTitle: string;
  bookId?: string;
  outlineId?: string;
  onAddChapter?: () => void;
}

export function OutlineHeader({
  bookTitle,
  bookId,
  outlineId,
  onAddChapter,
}: OutlineHeaderProps) {
  const router = useRouter();
  const [isConverting, setIsConverting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleContinueToWriting() {
    if (!bookId) return;
    setIsConverting(true);
    setError(null);

    const result = await convertOutlineToChaptersAction(bookId);
    if (!result.success) {
      setError(result.error);
      setIsConverting(false);
      return;
    }

    router.push(`/books/${bookId}/editor`);
  }

  async function handleRerunWizard() {
    if (!outlineId) return;
    setIsResetting(true);
    setError(null);

    const result = await resetOutlineForWizardAction(outlineId);
    if (!result.success) {
      setError(result.error);
      setIsResetting(false);
      return;
    }

    router.refresh();
  }

  return (
    <AppHeader title={`Outline - ${bookTitle}`}>
      <div className="flex items-center gap-2">
        {error && (
          <span className="text-[11px] text-red-600">{error}</span>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[11px] gap-1"
              disabled={!outlineId || isResetting}
            >
              {isResetting ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <RotateCcw className="w-3 h-3" />
              )}
              Re-run Wizard
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Regenerate Outline?</AlertDialogTitle>
              <AlertDialogDescription>
                This will clear your current outline sections and restart the
                Knowledge Wizard interview. Any existing chapters you have
                already written will be preserved, but the outline will be
                rebuilt from scratch.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleRerunWizard}>
                Regenerate Outline
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1">
          <Sparkles className="w-3 h-3" />
          AI Suggestions
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-[11px] gap-1"
          onClick={onAddChapter}
        >
          <Plus className="w-3 h-3" />
          Add Chapter
        </Button>
        <Button
          size="sm"
          className="h-7 text-[11px] bg-stone-900 hover:bg-stone-800 gap-1"
          onClick={handleContinueToWriting}
          disabled={isConverting || !bookId}
        >
          {isConverting ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <>
              Continue to Writing
              <ArrowRight className="w-3 h-3" />
            </>
          )}
        </Button>
      </div>
    </AppHeader>
  );
}
