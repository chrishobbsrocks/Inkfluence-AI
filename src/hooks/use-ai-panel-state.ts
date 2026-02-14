"use client";

import { useState, useMemo } from "react";
import type {
  GenerationTone,
  GenerationExpertise,
} from "@/types/chapter-generation";

export type SectionStatus = "done" | "active" | "pending";

export interface SectionItem {
  text: string;
  status: SectionStatus;
}

interface UseAiPanelStateOptions {
  keyPoints: string[];
  editorWordCount: number;
}

const TARGET_WORD_COUNT = 3000;

export function useAiPanelState({
  keyPoints,
  editorWordCount,
}: UseAiPanelStateOptions) {
  const [tone, setTone] = useState<GenerationTone>("professional");
  const [expertise, setExpertise] =
    useState<GenerationExpertise>("intermediate");
  const [generatedSectionCount, setGeneratedSectionCount] = useState(0);

  const sections: SectionItem[] = useMemo(() => {
    return keyPoints.map((text, index) => {
      let status: SectionStatus = "pending";
      if (index < generatedSectionCount) {
        status = "done";
      } else if (index === generatedSectionCount) {
        status = "active";
      }
      return { text, status };
    });
  }, [keyPoints, generatedSectionCount]);

  const progressPercent = Math.min(
    100,
    Math.round((editorWordCount / TARGET_WORD_COUNT) * 100)
  );

  return {
    tone,
    expertise,
    setTone,
    setExpertise,
    sections,
    wordCount: editorWordCount,
    targetWordCount: TARGET_WORD_COUNT,
    progressPercent,
    generatedSectionCount,
    incrementGeneratedCount: () =>
      setGeneratedSectionCount((c) => c + 1),
  };
}
