import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { getUserByClerkId } from "@/server/queries/users";
import { getOutlineWithSections } from "@/server/queries/outlines";
import { analyzeOutlineRequestSchema } from "@/lib/validations/outline-analysis";
import { analyzeOutline } from "@/lib/ai/chat-engine";

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

  const parseResult = analyzeOutlineRequestSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: parseResult.error.flatten(),
      },
      { status: 400 }
    );
  }

  const { outlineId } = parseResult.data;

  const result = await getOutlineWithSections(outlineId, user.id);
  if (!result) {
    return NextResponse.json({ error: "Outline not found" }, { status: 404 });
  }

  const { outline, sections } = result;

  if (sections.length === 0) {
    return NextResponse.json(
      { error: "Outline has no chapters to analyze" },
      { status: 400 }
    );
  }

  const chapters = sections.map((s) => ({
    chapterTitle: s.chapterTitle,
    keyPoints: (s.keyPoints as string[]) ?? [],
  }));

  try {
    const analysis = await analyzeOutline(
      chapters,
      outline.topic,
      outline.audience
    );
    return NextResponse.json(analysis);
  } catch (err) {
    console.error("Outline analysis failed:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Analysis failed unexpectedly",
      },
      { status: 500 }
    );
  }
}
