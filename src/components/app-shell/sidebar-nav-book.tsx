"use client";

import {
  ArrowLeft,
  List,
  Pencil,
  CheckCircle2,
  Users,
  Eye,
  Rocket,
} from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { SidebarSection } from "./sidebar-section";
import { useBookContext } from "./book-context";

export function SidebarNavBook() {
  const book = useBookContext();
  const bookId = book?.bookId ?? "";
  const bookTitle = book?.bookTitle ?? "Untitled Book";

  return (
    <>
      <SidebarItem href="/dashboard" icon={ArrowLeft} label="My Books" exact />
      <SidebarSection label={bookTitle} />
      <SidebarItem
        href={`/books/${bookId}/outline`}
        icon={List}
        label="Outline"
      />
      <SidebarItem
        href={`/books/${bookId}/editor`}
        icon={Pencil}
        label="Chapters"
      />
      <SidebarItem
        href={`/books/${bookId}/qa`}
        icon={CheckCircle2}
        label="Quality Review"
      />
      <SidebarItem
        href={`/books/${bookId}/reviews`}
        icon={Users}
        label="Reviews"
      />
      <SidebarItem
        href={`/books/${bookId}/preview`}
        icon={Eye}
        label="Preview"
      />
      <SidebarItem
        href={`/books/${bookId}/publish`}
        icon={Rocket}
        label="Publish"
      />
    </>
  );
}
