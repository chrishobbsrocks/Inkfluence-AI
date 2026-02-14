"use client";

import { Button } from "@/components/ui/button";
import type { GenerationExpertise } from "@/types/chapter-generation";

const EXPERTISE_LEVELS: { value: GenerationExpertise; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "expert", label: "Expert" },
];

interface ExpertiseSelectorProps {
  value: GenerationExpertise;
  onChange: (expertise: GenerationExpertise) => void;
  disabled?: boolean;
}

export function ExpertiseSelector({
  value,
  onChange,
  disabled,
}: ExpertiseSelectorProps) {
  return (
    <div>
      <div className="text-[11px] font-medium text-stone-500 mb-1.5">
        Expertise level
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {EXPERTISE_LEVELS.map((e) => (
          <Button
            key={e.value}
            variant={value === e.value ? "default" : "outline"}
            size="sm"
            disabled={disabled}
            onClick={() => onChange(e.value)}
            className={`h-6 text-[10px] px-2 ${
              value === e.value ? "bg-stone-900 hover:bg-stone-800" : ""
            }`}
          >
            {e.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
