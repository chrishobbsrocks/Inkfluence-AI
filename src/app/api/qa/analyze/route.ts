import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { getUserByClerkId } from "@/server/queries/users";
import { getBookById } from "@/server/queries/books";
import { qaAnalyzeRequestSchema } from "@/lib/validations/qa-analysis";
import { analyzeBookQuality } from "@/lib/ai/qa-engine";
import { saveQAAnalysis } from "@/server/mutations/qa-analyses";

export async function POST(request: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserByClerkId(clerkId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parseResult = qaAnalyzeRequestSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parseResult.error.flatten() },
      { status: 400 }
    );
  }

  const { bookId } = parseResult.data;

  // Verify book ownership
  const book = await getBookById(bookId, user.id);
  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  try {
    const result = await analyzeBookQuality(bookId, user.id);
    const saved = await saveQAAnalysis(bookId, result);

    return NextResponse.json({
      analysisId: saved.id,
      ...result,
    });
  } catch (err) {
    console.error("QA analysis failed:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Quality analysis failed unexpectedly",
      },
      { status: 500 }
    );
  }
}
