"use client";

import { Plus } from "lucide-react";

interface AddChapterButtonProps {
  onClick: () => void;
}

export function AddChapterButton({ onClick }: AddChapterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg border border-dashed border-stone-300 text-stone-400 cursor-pointer hover:border-stone-400 hover:text-stone-500 transition-colors"
    >
      <Plus className="w-3.5 h-3.5" />
      <span className="text-sm">Add new chapter...</span>
    </button>
  );
}
