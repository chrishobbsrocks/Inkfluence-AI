"use client";

import { Check, ChevronRight } from "lucide-react";
import type { SectionItem } from "@/hooks/use-ai-panel-state";

interface SectionChecklistProps {
  sections: SectionItem[];
}

export function SectionChecklist({ sections }: SectionChecklistProps) {
  if (sections.length === 0) return null;

  return (
    <div>
      <div className="text-[11px] font-semibold text-stone-600 mb-2">
        Sections
      </div>
      <div className="space-y-1">
        {sections.map((s, i) => (
          <div
            key={i}
            className={`text-[12px] py-1 flex items-center gap-2 ${
              s.status === "done"
                ? "text-stone-400"
                : s.status === "active"
                  ? "text-stone-800 font-semibold"
                  : "text-stone-300"
            }`}
          >
            {s.status === "done" ? (
              <Check className="w-3 h-3" />
            ) : s.status === "active" ? (
              <ChevronRight className="w-3 h-3" />
            ) : (
              <div className="w-3 h-3 rounded-full border border-stone-300" />
            )}
            {s.text}
          </div>
        ))}
      </div>
    </div>
  );
}
