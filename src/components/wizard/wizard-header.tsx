"use client";

import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WizardStepper } from "./wizard-stepper";
import type { WizardPhase } from "@/types/wizard";

interface WizardHeaderProps {
  currentPhase: WizardPhase;
  showingOutlinePreview?: boolean;
  onSaveAndExit: () => void;
  isSaving?: boolean;
}

export function WizardHeader({
  currentPhase,
  showingOutlinePreview = false,
  onSaveAndExit,
  isSaving = false,
}: WizardHeaderProps) {
  return (
    <header className="h-13 px-5 flex items-center justify-between border-b border-stone-200 bg-white">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-stone-900 flex items-center justify-center">
          <BookOpen className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-semibold text-sm text-stone-900 tracking-tight font-heading">
          Inkfluence <span className="text-stone-400 font-normal">AI</span>
        </span>
      </div>

      {/* Stepper */}
      <WizardStepper currentPhase={currentPhase} showingOutlinePreview={showingOutlinePreview} />

      {/* Save & Exit */}
      <Button
        variant="outline"
        size="sm"
        className="h-7 text-[11px]"
        onClick={onSaveAndExit}
        disabled={isSaving}
      >
        Save & Exit
      </Button>
    </header>
  );
}
