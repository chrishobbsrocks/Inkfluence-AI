"use client";

import { useParams } from "next/navigation";
import { BookContextSetter } from "@/components/app-shell";

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams<{ bookId: string }>();
  const bookId = params.bookId;

  return (
    <>
      <BookContextSetter bookId={bookId} bookTitle="Untitled Book" />
      {children}
    </>
  );
}
