"use client";

import { Button } from "@/components/ui/button";
import type { GenerationTone } from "@/types/chapter-generation";

const TONES: { value: GenerationTone; label: string }[] = [
  { value: "professional", label: "Professional" },
  { value: "conversational", label: "Conversational" },
  { value: "academic", label: "Academic" },
];

interface ToneSelectorProps {
  value: GenerationTone;
  onChange: (tone: GenerationTone) => void;
  disabled?: boolean;
}

export function ToneSelector({ value, onChange, disabled }: ToneSelectorProps) {
  return (
    <div>
      <div className="text-[11px] font-medium text-stone-500 mb-1.5">Tone</div>
      <div className="flex gap-1.5 flex-wrap">
        {TONES.map((t) => (
          <Button
            key={t.value}
            variant={value === t.value ? "default" : "outline"}
            size="sm"
            disabled={disabled}
            onClick={() => onChange(t.value)}
            className={`h-6 text-[10px] px-2 ${
              value === t.value ? "bg-stone-900 hover:bg-stone-800" : ""
            }`}
          >
            {t.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
