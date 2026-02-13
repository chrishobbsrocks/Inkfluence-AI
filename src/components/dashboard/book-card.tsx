"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Book } from "@/server/db/schema";

function getBookProgress(status: string): number {
  switch (status) {
    case "draft":
      return 15;
    case "writing":
      return 50;
    case "review":
      return 80;
    case "published":
      return 100;
    default:
      return 0;
  }
}

function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function statusLabel(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function BookCard({ book }: { book: Book }) {
  const progress = getBookProgress(book.status);
  const isPublished = book.status === "published";

  return (
    <Link href={`/books/${book.id}/outline`}>
      <Card className="border-stone-200 hover:shadow-md transition-shadow cursor-pointer group">
        <div className="p-3">
          <div className="h-20 bg-stone-100 rounded-md mb-3 flex items-center justify-center group-hover:bg-stone-200/60 transition-colors">
            <BookOpen className="w-6 h-6 text-stone-300" />
          </div>
          <h3 className="font-semibold text-sm text-stone-800 mb-1 truncate">
            {book.title}
          </h3>
          <p className="text-[11px] text-stone-400 mb-2.5">
            {book.chapterCount} chapters &middot;{" "}
            {book.wordCount.toLocaleString()} words
          </p>
          {!isPublished && (
            <Progress
              value={progress}
              className="h-1 mb-2.5 bg-stone-100"
            />
          )}
          <div className="flex items-center justify-between">
            <Badge
              variant={isPublished ? "default" : "secondary"}
              className={
                isPublished
                  ? "bg-stone-900 text-white text-[10px] px-2 py-0.5"
                  : "text-[10px] px-2 py-0.5"
              }
            >
              {statusLabel(book.status)}
            </Badge>
            <span className="text-[10px] text-stone-400">
              {formatDate(book.updatedAt)}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
