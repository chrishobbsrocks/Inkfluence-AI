import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserByClerkId } from "@/server/queries/users";
import { getBookById } from "@/server/queries/books";
import { getChaptersByBookId } from "@/server/queries/chapters";
import { AppHeader } from "@/components/app-shell";
import { PreviewWrapper } from "@/components/preview";
import { BookOpen } from "lucide-react";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
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
        <AppHeader title="Preview & Format" />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-3">
            <BookOpen className="w-10 h-10 text-stone-300 mx-auto" />
            <h2 className="text-lg font-semibold text-stone-700">
              Nothing to preview yet
            </h2>
            <p className="text-sm text-stone-500 max-w-sm">
              Write some chapter content first, then come back to preview and
              format your book.
            </p>
            <Link
              href={`/books/${bookId}/editor`}
              className="inline-block text-sm text-stone-900 underline hover:text-stone-700"
            >
              Go to Editor
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <PreviewWrapper
      bookId={bookId}
      bookTitle={book.title}
      chapters={chapters.map((c) => ({
        id: c.id,
        title: c.title,
        content: c.content,
        orderIndex: c.orderIndex,
        wordCount: c.wordCount,
      }))}
    />
  );
}
