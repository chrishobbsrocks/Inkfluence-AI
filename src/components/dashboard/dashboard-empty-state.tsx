"use client";

import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardEmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4">
        <BookOpen className="w-8 h-8 text-stone-300" />
      </div>
      <h3 className="text-lg font-semibold text-stone-700 mb-1">
        No books yet
      </h3>
      <p className="text-sm text-stone-400 mb-6">
        Create your first book to get started
      </p>
      <Button
        className="bg-stone-900 hover:bg-stone-800"
        onClick={onCreateClick}
      >
        Create Your First Book
      </Button>
    </div>
  );
}
