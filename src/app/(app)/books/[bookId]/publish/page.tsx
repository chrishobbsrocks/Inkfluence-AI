import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Rocket } from "lucide-react";
import { AppHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { PublishPageClient } from "@/components/publish";
import { getUserByClerkId } from "@/server/queries/users";
import { getBookById } from "@/server/queries/books";
import { getChaptersByBookId } from "@/server/queries/chapters";
import { getLatestQAAnalysis } from "@/server/queries/qa-analyses";
import { getBookMetadata } from "@/server/queries/book-metadata";
import type { PrePublishChecklistItem } from "@/types/book-metadata";

export default async function PublishPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await getUserByClerkId(clerkId);
  if (!user) redirect("/sign-in");

  const book = await getBookById(bookId, user.id);
  if (!book) redirect("/dashboard");

  // Fetch all data needed for checklist in parallel
  const [chapters, latestQA, metadata] = await Promise.all([
    getChaptersByBookId(bookId, user.id),
    getLatestQAAnalysis(bookId, user.id),
    getBookMetadata(bookId, user.id),
  ]);

  // Build checklist items from real data
  const chaptersComplete =
    chapters.length > 0 && chapters.every((ch) => ch.wordCount > 0);
  const qaScore = latestQA?.overallScore ?? 0;
  const qaPassed = qaScore >= 70;
  const coverFinalized = !!book.coverUrl;
  const metadataComplete =
    !!metadata?.description &&
    (metadata?.keywords?.length ?? 0) > 0 &&
    !!metadata?.category &&
    !!metadata?.price;

  const checklistItems: PrePublishChecklistItem[] = [
    {
      id: "chapters-complete",
      label: "All chapters complete",
      description: chaptersComplete
        ? `${chapters.length}/${chapters.length} chapters written and reviewed`
        : `${chapters.filter((ch) => ch.wordCount > 0).length}/${chapters.length} chapters have content`,
      completed: chaptersComplete,
      actionPath: `/books/{bookId}/editor`,
    },
    {
      id: "quality-check",
      label: "Quality check passed",
      description: qaPassed
        ? `Score: ${qaScore}/100 — Professional quality`
        : latestQA
          ? `Score: ${qaScore}/100 — Needs improvement`
          : "No quality analysis run yet",
      completed: qaPassed,
      actionPath: `/books/{bookId}/qa`,
    },
    {
      id: "cover-finalized",
      label: "Cover design finalized",
      description: coverFinalized
        ? "Cover approved"
        : "No cover uploaded yet",
      completed: coverFinalized,
      actionPath: `/books/{bookId}/preview`,
    },
    {
      id: "metadata-complete",
      label: "Metadata completed",
      description: metadataComplete
        ? "All metadata fields completed"
        : "Review auto-generated keywords and description",
      completed: metadataComplete,
    },
  ];

  return (
    <>
      <AppHeader title={`Publish \u2014 ${book.title}`}>
        <Button
          size="sm"
          className="h-8 text-xs bg-stone-900 hover:bg-stone-800 gap-1.5"
          disabled
        >
          <Rocket className="w-3 h-3" /> Publish to All Selected
        </Button>
      </AppHeader>
      <PublishPageClient
        bookId={bookId}
        checklistItems={checklistItems}
        metadata={metadata}
      />
    </>
  );
}
