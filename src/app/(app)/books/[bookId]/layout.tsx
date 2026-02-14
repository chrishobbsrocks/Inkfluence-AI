import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserByClerkId } from "@/server/queries/users";
import { getBookById } from "@/server/queries/books";
import { getChaptersByBookId } from "@/server/queries/chapters";
import { BookContextSetter } from "@/components/app-shell";

export default async function BookLayout({
  children,
  params,
}: {
  children: React.ReactNode;
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

  const chapterSummaries = chapters.map((c) => ({
    id: c.id,
    title: c.title,
    orderIndex: c.orderIndex,
    status: c.status,
  }));

  return (
    <>
      <BookContextSetter
        bookId={bookId}
        bookTitle={book.title}
        chapters={chapterSummaries}
      />
      {children}
    </>
  );
}
