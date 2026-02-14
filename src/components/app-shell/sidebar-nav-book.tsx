"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  List,
  Pencil,
  CheckCircle2,
  Users,
  Eye,
  Rocket,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarItem } from "./sidebar-item";
import { SidebarSection } from "./sidebar-section";
import { useBookContext } from "./book-context";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

function ChapterStatusDot({ status }: { status: string }) {
  const colorClass =
    status === "complete"
      ? "bg-green-500"
      : status === "writing"
        ? "bg-blue-500"
        : status === "draft"
          ? "bg-amber-500"
          : "bg-stone-300";

  return <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", colorClass)} />;
}

export function SidebarNavBook() {
  const book = useBookContext();
  const bookId = book?.bookId ?? "";
  const bookTitle = book?.bookTitle ?? "Untitled Book";
  const chapters = book?.chapters ?? [];
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isOnEditor = pathname.includes("/editor");
  const [expanded, setExpanded] = useState(isOnEditor);

  const currentChapterId = searchParams.get("chapter");

  return (
    <>
      <SidebarItem href="/dashboard" icon={ArrowLeft} label="My Books" exact />
      <SidebarSection label={bookTitle} />
      <SidebarItem
        href={`/books/${bookId}/outline`}
        icon={List}
        label="Outline"
      />

      {/* Chapters — collapsible with chapter list */}
      <Collapsible open={expanded} onOpenChange={setExpanded}>
        <CollapsibleTrigger asChild>
          <button
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs transition-colors",
              isOnEditor
                ? "bg-white text-stone-900 font-semibold shadow-sm border border-stone-200"
                : "text-stone-500 hover:text-stone-700 hover:bg-stone-100"
            )}
          >
            <Pencil className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="flex-1 text-left">Chapters</span>
            {chapters.length > 0 && (
              <ChevronRight
                className={cn(
                  "w-3 h-3 transition-transform",
                  expanded && "rotate-90"
                )}
              />
            )}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {chapters.length > 0 ? (
            <div className="ml-6 mt-0.5 space-y-0.5">
              {chapters.map((chapter, i) => {
                const isActive =
                  isOnEditor &&
                  (currentChapterId === chapter.id ||
                    (!currentChapterId && i === 0));

                return (
                  <Link
                    key={chapter.id}
                    href={`/books/${bookId}/editor?chapter=${chapter.id}`}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 rounded text-[11px] transition-colors",
                      isActive
                        ? "bg-stone-100 text-stone-900 font-medium"
                        : "text-stone-400 hover:text-stone-600 hover:bg-stone-50"
                    )}
                  >
                    <ChapterStatusDot status={chapter.status} />
                    <span className="truncate">
                      {i + 1}. {chapter.title}
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="ml-6 mt-1 text-[10px] text-stone-400">
              No chapters yet
            </p>
          )}
        </CollapsibleContent>
      </Collapsible>

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
