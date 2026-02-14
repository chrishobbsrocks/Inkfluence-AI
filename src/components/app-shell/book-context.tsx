"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface ChapterSummary {
  id: string;
  title: string;
  orderIndex: number;
  status: string;
}

interface BookContextValue {
  bookId: string;
  bookTitle: string;
  chapters: ChapterSummary[];
}

const BookContext = createContext<BookContextValue | null>(null);

export function useBookContext() {
  return useContext(BookContext);
}

export function BookContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [book, setBook] = useState<BookContextValue | null>(null);

  return (
    <BookContext.Provider value={book}>
      <BookSetterContext.Provider value={setBook}>
        {children}
      </BookSetterContext.Provider>
    </BookContext.Provider>
  );
}

const BookSetterContext = createContext<
  React.Dispatch<React.SetStateAction<BookContextValue | null>>
>(() => {});

export function BookContextSetter({
  bookId,
  bookTitle,
  chapters = [],
}: {
  bookId: string;
  bookTitle: string;
  chapters?: ChapterSummary[];
}) {
  const setBook = useContext(BookSetterContext);

  useEffect(() => {
    setBook({ bookId, bookTitle, chapters });
    return () => setBook(null);
  }, [bookId, bookTitle, chapters, setBook]);

  return null;
}
