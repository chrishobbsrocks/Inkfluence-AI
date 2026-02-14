"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { PrePublishChecklistItem } from "@/types/book-metadata";

export interface PrePublishChecklistProps {
  bookId: string;
  items: PrePublishChecklistItem[];
}

export function PrePublishChecklist({
  bookId,
  items,
}: PrePublishChecklistProps) {
  return (
    <Card className="border-stone-200">
      <CardContent className="p-4">
        <div className="text-xs font-semibold text-stone-600 mb-3">
          Pre-publish checklist
        </div>
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 py-3 border-b border-stone-100 last:border-0"
          >
            <div
              className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${
                item.completed
                  ? "bg-stone-900 text-white"
                  : "border-2 border-stone-300"
              }`}
            >
              {item.completed && <Check className="w-3 h-3" />}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-stone-700">
                {item.label}
              </div>
              <div className="text-[11px] text-stone-400">
                {item.description}
              </div>
            </div>
            {!item.completed && item.actionPath && (
              <Button variant="outline" size="sm" className="h-7 text-[11px]" asChild>
                <Link href={item.actionPath.replace("{bookId}", bookId)}>
                  Complete &rarr;
                </Link>
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
