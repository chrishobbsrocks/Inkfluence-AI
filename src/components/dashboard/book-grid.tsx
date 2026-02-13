"use client";

import type { Book } from "@/server/db/schema";
import { BookCard } from "./book-card";
import { CreateBookCard } from "./create-book-card";

interface BookGridProps {
  books: Book[];
  onCreateClick: () => void;
}

export function BookGrid({ books, onCreateClick }: BookGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
      <CreateBookCard onClick={onCreateClick} />
    </div>
  );
}
