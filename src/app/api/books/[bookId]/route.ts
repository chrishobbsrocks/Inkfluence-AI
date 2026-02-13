import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { getUserByClerkId } from "@/server/queries/users";
import { getBookById } from "@/server/queries/books";
import { updateBook, softDeleteBook } from "@/server/mutations/books";
import { updateBookSchema, bookIdSchema } from "@/lib/validations/books";

type RouteContext = { params: Promise<{ bookId: string }> };

async function resolveAuth() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;
  const user = await getUserByClerkId(clerkId);
  return user;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const user = await resolveAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { bookId } = await params;
  const idParse = bookIdSchema.safeParse(bookId);
  if (!idParse.success) {
    return NextResponse.json({ error: "Invalid book ID" }, { status: 400 });
  }

  const book = await getBookById(bookId, user.id);
  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  return NextResponse.json(book);
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const user = await resolveAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { bookId } = await params;
  const idParse = bookIdSchema.safeParse(bookId);
  if (!idParse.success) {
    return NextResponse.json({ error: "Invalid book ID" }, { status: 400 });
  }

  const body = await request.json();
  const parseResult = updateBookSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parseResult.error.flatten() },
      { status: 400 }
    );
  }

  const result = await updateBook(bookId, user.id, parseResult.data);
  if (!result.success) {
    const status =
      result.code === "NOT_FOUND"
        ? 404
        : result.code === "INVALID_STATUS_TRANSITION"
          ? 422
          : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json(result.data);
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const user = await resolveAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { bookId } = await params;
  const idParse = bookIdSchema.safeParse(bookId);
  if (!idParse.success) {
    return NextResponse.json({ error: "Invalid book ID" }, { status: 400 });
  }

  const result = await softDeleteBook(bookId, user.id);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }

  return NextResponse.json({ deleted: true, id: bookId });
}
