import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserByClerkId } from "@/server/queries/users";
import { getBookById } from "@/server/queries/books";
import { getOutlineByBookId, getOutlineWithSections } from "@/server/queries/outlines";
import { WizardContainer } from "@/components/wizard";
import { OutlineEditorWrapper } from "@/components/outline";
import type { ConversationMessage } from "@/types/wizard";

export default async function OutlinePage({
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

  const outline = await getOutlineByBookId(bookId, user.id);

  // Check if outline has sections (i.e. outline generation is complete)
  let sections: Array<{
    id: string;
    chapterTitle: string;
    keyPoints: unknown;
    orderIndex: number;
    aiSuggested: boolean | null;
  }> = [];

  if (outline) {
    const result = await getOutlineWithSections(outline.id, user.id);
    sections = result?.sections ?? [];
  }

  const userInitial = user.name?.[0]?.toUpperCase() ?? "U";

  // If outline exists AND has sections -> show outline editor
  if (outline && sections.length > 0) {
    const editorSections = sections.map((s) => ({
      id: s.id,
      chapterTitle: s.chapterTitle,
      keyPoints: (s.keyPoints as string[]) ?? [],
      orderIndex: s.orderIndex,
      aiSuggested: s.aiSuggested ?? false,
    }));

    return (
      <OutlineEditorWrapper
        bookId={bookId}
        bookTitle={book.title}
        outlineId={outline.id}
        initialSections={editorSections}
      />
    );
  }

  // Otherwise show wizard (either start form or resume chat)
  const outlineData = outline
    ? {
        id: outline.id,
        conversationHistory:
          (outline.conversationHistory as ConversationMessage[]) ?? [],
        topic: outline.topic,
        audience: outline.audience,
        expertiseLevel: outline.expertiseLevel,
      }
    : null;

  return (
    <WizardContainer
      bookId={bookId}
      bookTitle={book.title}
      outline={outlineData}
      userInitial={userInitial}
    />
  );
}
