"use client";

import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToneSelector } from "./ai-panel/tone-selector";
import { ExpertiseSelector } from "./ai-panel/expertise-selector";
import { ChapterProgress } from "./ai-panel/chapter-progress";
import { SectionChecklist } from "./ai-panel/section-checklist";
import type { GenerationTone, GenerationExpertise } from "@/types/chapter-generation";
import type { SectionItem } from "@/hooks/use-ai-panel-state";

export interface AiWritingPanelProps {
  tone: GenerationTone;
  expertise: GenerationExpertise;
  onToneChange: (tone: GenerationTone) => void;
  onExpertiseChange: (expertise: GenerationExpertise) => void;
  wordCount: number;
  targetWordCount: number;
  progressPercent: number;
  sections: SectionItem[];
  isGenerating: boolean;
  onGenerate: () => void;
}

export function AiWritingPanel({
  tone,
  expertise,
  onToneChange,
  onExpertiseChange,
  wordCount,
  targetWordCount,
  progressPercent,
  sections,
  isGenerating,
  onGenerate,
}: AiWritingPanelProps) {
  return (
    <div className="w-64 bg-stone-50 border-l border-stone-200 flex flex-col shrink-0">
      {/* Controls section */}
      <div className="p-4 border-b border-stone-200 space-y-3">
        <div className="text-xs font-semibold text-stone-600">
          AI Writing Assistant
        </div>
        <ToneSelector
          value={tone}
          onChange={onToneChange}
          disabled={isGenerating}
        />
        <ExpertiseSelector
          value={expertise}
          onChange={onExpertiseChange}
          disabled={isGenerating}
        />
      </div>

      {/* Progress section */}
      <div className="flex-1 p-4">
        <ChapterProgress
          wordCount={wordCount}
          targetWordCount={targetWordCount}
          progressPercent={progressPercent}
        />
        <SectionChecklist sections={sections} />
      </div>

      {/* Generate button */}
      <div className="p-3 border-t border-stone-200">
        <Button
          className="w-full h-9 text-xs bg-stone-900 hover:bg-stone-800 gap-1.5"
          disabled={isGenerating}
          onClick={onGenerate}
        >
          {isGenerating ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Sparkles className="w-3 h-3" />
          )}
          {isGenerating ? "Generating..." : "Generate Chapter"}
        </Button>
      </div>
    </div>
  );
}
