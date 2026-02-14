import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { AppHeader } from "@/components/app-shell";
import { PublishPageClient } from "@/components/publish";
import { getUserByClerkId } from "@/server/queries/users";
import { getBookById } from "@/server/queries/books";
import { getChaptersByBookId } from "@/server/queries/chapters";
import { getLatestQAAnalysis } from "@/server/queries/qa-analyses";
import { getBookMetadata } from "@/server/queries/book-metadata";
import { getBookPlatforms } from "@/server/queries/publishing-platforms";
import { initializeDefaultPlatforms } from "@/server/mutations/publishing-platforms";
import {
  PLATFORM_DEFINITIONS,
  type PlatformCardData,
  type PlatformCode,
  type PlatformStatus,
} from "@/types/publishing-platform";
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

  // Lazy-initialize default platforms for this book
  await initializeDefaultPlatforms(bookId);

  // Fetch all data needed for checklist and platforms in parallel
  const [chapters, latestQA, metadata, dbPlatforms] = await Promise.all([
    getChaptersByBookId(bookId, user.id),
    getLatestQAAnalysis(bookId, user.id),
    getBookMetadata(bookId, user.id),
    getBookPlatforms(bookId, user.id),
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

  const allChecksPassed = checklistItems.every((item) => item.completed);

  // Map DB platforms to PlatformCardData, including all defined platforms
  const platformCards: PlatformCardData[] = PLATFORM_DEFINITIONS.map((def) => {
    const dbRow = dbPlatforms.find((p) => p.platformCode === def.code);
    return {
      id: dbRow?.id ?? null,
      code: def.code as PlatformCode,
      name: def.name,
      connected: dbRow?.connected ?? false,
      selected: false,
      status: (dbRow?.status as PlatformStatus) ?? "draft",
      submittedAt: dbRow?.submittedAt?.toISOString() ?? null,
      publishedAt: dbRow?.publishedAt?.toISOString() ?? null,
      guidelines: def.guidelines,
    };
  });

  return (
    <>
      <AppHeader title={`Publish — ${book.title}`} />
      <PublishPageClient
        bookId={bookId}
        checklistItems={checklistItems}
        metadata={metadata}
        platforms={platformCards}
        templateId="modern"
        allChecksPassed={allChecksPassed}
      />
    </>
  );
}
