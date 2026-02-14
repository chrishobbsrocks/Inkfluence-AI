import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserByClerkId } from "@/server/queries/users";
import { getBookById } from "@/server/queries/books";
import { getChaptersByBookId } from "@/server/queries/chapters";
import { getLatestQAAnalysis } from "@/server/queries/qa-analyses";
import { AppHeader } from "@/components/app-shell";
import { QAWrapper } from "@/components/qa";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import type { QAAnalysisResult } from "@/types/qa-analysis";

export default async function QualityReviewPage({
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
        <AppHeader title="Quality Review" />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-3">
            <BookOpen className="w-10 h-10 text-stone-300 mx-auto" />
            <h2 className="text-lg font-semibold text-stone-700">
              No chapters yet
            </h2>
            <p className="text-sm text-stone-500 max-w-sm">
              Write some chapter content before running a quality review.
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

  // Fetch latest analysis (may be null if never run)
  const savedAnalysis = await getLatestQAAnalysis(bookId, user.id);

  const initialAnalysis: QAAnalysisResult | null = savedAnalysis
    ? {
        overallScore: savedAnalysis.overallScore,
        qualityLevel: savedAnalysis.qualityLevel as QAAnalysisResult["qualityLevel"],
        readability: savedAnalysis.readability,
        consistency: savedAnalysis.consistency,
        structure: savedAnalysis.structure,
        accuracy: savedAnalysis.accuracy,
        summary: savedAnalysis.summary,
        chapterScores: savedAnalysis.chapterScores,
        suggestions: savedAnalysis.suggestions,
        analyzedAt: savedAnalysis.createdAt.toISOString(),
      }
    : null;

  return (
    <QAWrapper
      bookId={bookId}
      initialAnalysis={initialAnalysis}
    />
  );
}
