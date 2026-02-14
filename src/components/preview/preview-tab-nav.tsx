"use client";

import type { PreviewTab } from "@/types/preview";

interface PreviewTabNavProps {
  activeTab: PreviewTab;
  onTabChange: (tab: PreviewTab) => void;
}

const TABS: { id: PreviewTab; label: string }[] = [
  { id: "preview", label: "Book Preview" },
  { id: "cover", label: "Cover Design" },
  { id: "toc", label: "Table of Contents" },
];

export function PreviewTabNav({ activeTab, onTabChange }: PreviewTabNavProps) {
  return (
    <div className="flex gap-0 border-b border-stone-200 mb-5">
      {TABS.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2.5 text-xs border-b-2 -mb-px transition-colors ${
              isActive
                ? "font-semibold text-stone-900 border-stone-900"
                : "text-stone-400 border-transparent hover:text-stone-600"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
