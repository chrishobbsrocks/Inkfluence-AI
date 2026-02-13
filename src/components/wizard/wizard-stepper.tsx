"use client";

import { Check } from "lucide-react";
import type { WizardPhase } from "@/types/wizard";

const STEPS = ["Topic", "Audience", "Expertise", "Outline", "Review"] as const;

const PHASE_TO_STEP: Record<WizardPhase, number> = {
  topic_exploration: 0,
  audience_definition: 1,
  expertise_extraction: 2,
  gap_analysis: 3,
  outline_generation: 4,
};

interface WizardStepperProps {
  currentPhase: WizardPhase;
}

export function WizardStepper({ currentPhase }: WizardStepperProps) {
  const activeStep = PHASE_TO_STEP[currentPhase];

  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className="flex items-center gap-1.5">
            {/* Step circle */}
            {i < activeStep ? (
              // Completed
              <div className="w-6 h-6 rounded-full bg-stone-400 text-white flex items-center justify-center">
                <Check className="w-3 h-3" />
              </div>
            ) : i === activeStep ? (
              // Active
              <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px] font-bold">
                {i + 1}
              </div>
            ) : (
              // Future
              <div className="w-6 h-6 rounded-full border-2 border-stone-200 text-stone-400 flex items-center justify-center text-[10px] font-bold">
                {i + 1}
              </div>
            )}
            {/* Step label */}
            <span
              className={`text-[11px] ${
                i === activeStep
                  ? "font-semibold text-stone-900"
                  : "text-stone-400"
              }`}
            >
              {step}
            </span>
          </div>
          {/* Connector line */}
          {i < STEPS.length - 1 && (
            <div className="w-8 h-px bg-stone-200 mx-2" />
          )}
        </div>
      ))}
    </div>
  );
}
