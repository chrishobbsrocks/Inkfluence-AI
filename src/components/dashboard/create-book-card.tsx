"use client";

import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";

export function CreateBookCard({ onClick }: { onClick: () => void }) {
  return (
    <Card
      className="border-dashed border-stone-300 hover:border-stone-400 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="p-3 flex flex-col items-center justify-center min-h-[200px]">
        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mb-3">
          <Plus className="w-5 h-5 text-stone-400" />
        </div>
        <span className="text-sm font-semibold text-stone-500">
          Create New Book
        </span>
        <span className="text-[11px] text-stone-400 mt-1">
          Start from scratch or template
        </span>
      </div>
    </Card>
  );
}
