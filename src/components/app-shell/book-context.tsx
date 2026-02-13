"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface BookContextValue {
  bookId: string;
  bookTitle: string;
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
}: {
  bookId: string;
  bookTitle: string;
}) {
  const setBook = useContext(BookSetterContext);

  useEffect(() => {
    setBook({ bookId, bookTitle });
    return () => setBook(null);
  }, [bookId, bookTitle, setBook]);

  return null;
}
