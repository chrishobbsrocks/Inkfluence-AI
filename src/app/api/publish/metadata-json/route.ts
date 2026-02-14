import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { getUserByClerkId } from "@/server/queries/users";
import { getBookById } from "@/server/queries/books";
import { getBookMetadata } from "@/server/queries/book-metadata";
import { publishRequestSchema } from "@/lib/validations/publishing-platforms";
import { buildPlatformMetadataJson } from "@/lib/export/metadata-json-builder";

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

  const parseResult = publishRequestSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parseResult.error.flatten() },
      { status: 400 }
    );
  }

  const { bookId, platformCode } = parseResult.data;

  const book = await getBookById(bookId, user.id);
  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  const metadata = await getBookMetadata(bookId, user.id);

  const metadataJson = buildPlatformMetadataJson(
    { title: book.title },
    metadata,
    platformCode
  );

  const jsonStr = JSON.stringify(metadataJson, null, 2);
  const filename = `${book.title.replace(/[/\\:*?"<>|]/g, "")}-${platformCode}-metadata.json`;

  return new Response(jsonStr, {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(Buffer.byteLength(jsonStr, "utf-8")),
    },
  });
}
