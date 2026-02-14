import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { getUserByClerkId } from "@/server/queries/users";
import { getBookById } from "@/server/queries/books";
import { getChaptersByBookId } from "@/server/queries/chapters";
import { exportRequestSchema } from "@/lib/validations/export";
import { generatePdfBuffer } from "@/lib/export/pdf-renderer";
import { BOOK_TEMPLATES } from "@/lib/templates";

function sanitizeFilename(name: string): string {
  return name.replace(/[/\\:*?"<>|]/g, "_").trim() || "export";
}

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

  const parsed = exportRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { bookId, templateId } = parsed.data;

  const template = BOOK_TEMPLATES.find((t) => t.id === templateId);
  if (!template) {
    return NextResponse.json({ error: "Invalid template" }, { status: 400 });
  }

  const book = await getBookById(bookId, user.id);
  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  const chapters = await getChaptersByBookId(bookId, user.id);
  if (chapters.length === 0) {
    return NextResponse.json(
      { error: "Book has no chapters to export" },
      { status: 422 }
    );
  }

  try {
    const pdfBuffer = await generatePdfBuffer(
      { id: book.id, title: book.title, authorName: user.name },
      chapters.map((c) => ({
        id: c.id,
        title: c.title,
        content: c.content,
        orderIndex: c.orderIndex,
      })),
      template
    );

    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${sanitizeFilename(book.title)}.pdf"`,
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (err) {
    console.error("PDF generation failed:", err);
    return NextResponse.json(
      { error: "PDF generation failed. Please try again." },
      { status: 500 }
    );
  }
}
