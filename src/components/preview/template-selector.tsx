"use client";

import type { BookTemplate } from "@/types/preview";

interface TemplateSelectorProps {
  templates: BookTemplate[];
  selectedId: string;
  onSelect: (templateId: string) => void;
}

export function TemplateSelector({
  templates,
  selectedId,
  onSelect,
}: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {templates.map((template) => {
        const isSelected = template.id === selectedId;
        return (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            className={`p-2 rounded-lg border text-center cursor-pointer transition-colors ${
              isSelected
                ? "border-stone-900 bg-stone-50"
                : "border-stone-200 hover:border-stone-300"
            }`}
          >
            <div className="h-10 bg-stone-100 rounded mb-1.5 flex items-center justify-center text-[9px] text-stone-400">
              {template.name}
            </div>
            <div
              className={`text-[10px] ${
                isSelected
                  ? "font-semibold text-stone-900"
                  : "text-stone-500"
              }`}
            >
              {template.name}
            </div>
          </button>
        );
      })}
    </div>
  );
}
