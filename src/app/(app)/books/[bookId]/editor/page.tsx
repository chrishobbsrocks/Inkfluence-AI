import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserByClerkId } from "@/server/queries/users";
import { getBookById } from "@/server/queries/books";
import { getChaptersByBookId } from "@/server/queries/chapters";
import { AppHeader } from "@/components/app-shell";
import { ChapterEditorWrapper } from "@/components/editor";
import { BookOpen } from "lucide-react";

export default async function EditorPage({
  params,
  searchParams,
}: {
  params: Promise<{ bookId: string }>;
  searchParams: Promise<{ chapter?: string }>;
}) {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await getUserByClerkId(clerkId);
  if (!user) redirect("/sign-in");

  const { bookId } = await params;
  const book = await getBookById(bookId, user.id);
  if (!book) redirect("/dashboard");

  const chapters = await getChaptersByBookId(bookId, user.id);

  // No chapters — show empty state
  if (chapters.length === 0) {
    return (
      <>
        <AppHeader title="Chapters" />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-3">
            <BookOpen className="w-10 h-10 text-stone-300 mx-auto" />
            <h2 className="text-lg font-semibold text-stone-700">
              No chapters yet
            </h2>
            <p className="text-sm text-stone-500 max-w-sm">
              Complete your outline to start writing. The outline will generate
              your chapter structure.
            </p>
            <Link
              href={`/books/${bookId}/outline`}
              className="inline-block text-sm text-stone-900 underline hover:text-stone-700"
            >
              Go to Outline
            </Link>
          </div>
        </div>
      </>
    );
  }

  // Determine current chapter from search params or default to first
  const { chapter: chapterIdParam } = await searchParams;
  const currentChapter = chapterIdParam
    ? chapters.find((c) => c.id === chapterIdParam) ?? chapters[0]!
    : chapters[0]!;

  // Find next chapter
  const currentIdx = chapters.findIndex((c) => c.id === currentChapter.id);
  const nextChapter =
    currentIdx < chapters.length - 1 ? chapters[currentIdx + 1]! : null;

  return (
    <ChapterEditorWrapper
      bookId={bookId}
      currentChapter={{
        id: currentChapter.id,
        title: currentChapter.title,
        content: currentChapter.content,
        orderIndex: currentChapter.orderIndex,
      }}
      nextChapterId={nextChapter?.id ?? null}
    />
  );
}
