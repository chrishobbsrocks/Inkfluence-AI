"use client";

import { useState } from "react";
import { Plus, Filter } from "lucide-react";
import { AppHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { StatsCards } from "./stats-cards";
import { BookGrid } from "./book-grid";
import { CreateBookDialog } from "./create-book-dialog";
import { DashboardEmptyState } from "./dashboard-empty-state";
import type { Book } from "@/server/db/schema";

interface DashboardContentProps {
  books: Book[];
  stats: {
    totalBooks: number;
    publishedCount: number;
    writingCount: number;
    draftCount: number;
    reviewCount: number;
    totalWordCount: number;
  };
}

export function DashboardContent({ books, stats }: DashboardContentProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <AppHeader title="My Books">
        <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
          <Filter className="w-3.5 h-3.5" />
          Filters
        </Button>
        <Button
          size="sm"
          className="h-8 text-xs gap-1.5 bg-stone-900 hover:bg-stone-800"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="w-3.5 h-3.5" />
          New Book
        </Button>
      </AppHeader>
      <div className="flex-1 bg-stone-50/50 p-5 overflow-y-auto">
        <StatsCards stats={stats} />
        {books.length === 0 ? (
          <DashboardEmptyState onCreateClick={() => setDialogOpen(true)} />
        ) : (
          <BookGrid books={books} onCreateClick={() => setDialogOpen(true)} />
        )}
      </div>
      <CreateBookDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
