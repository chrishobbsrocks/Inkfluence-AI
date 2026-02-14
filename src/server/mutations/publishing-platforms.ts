import { eq, and } from "drizzle-orm";
import { db } from "@/server/db";
import { publishingPlatforms } from "@/server/db/schema/publishing-platforms";
import { PLATFORM_DEFINITIONS } from "@/types/publishing-platform";

/** Connect (upsert) a platform for a book */
export async function connectPlatform(bookId: string, platformCode: string) {
  const def = PLATFORM_DEFINITIONS.find((p) => p.code === platformCode);
  if (!def) throw new Error(`Unknown platform: ${platformCode}`);

  const result = await db
    .insert(publishingPlatforms)
    .values({
      bookId,
      platformCode: def.code,
      platformName: def.name,
      connected: true,
      status: "draft",
    })
    .onConflictDoUpdate({
      target: [publishingPlatforms.bookId, publishingPlatforms.platformCode],
      set: { connected: true },
    })
    .returning();

  return result[0]!;
}

/** Disconnect a platform */
export async function disconnectPlatform(
  bookId: string,
  platformCode: string
) {
  const result = await db
    .update(publishingPlatforms)
    .set({ connected: false })
    .where(
      and(
        eq(publishingPlatforms.bookId, bookId),
        eq(publishingPlatforms.platformCode, platformCode)
      )
    )
    .returning();

  return result[0] ?? null;
}

/** Mark a platform as submitted */
export async function markPlatformSubmitted(
  bookId: string,
  platformCode: string
) {
  const result = await db
    .update(publishingPlatforms)
    .set({ status: "submitted", submittedAt: new Date() })
    .where(
      and(
        eq(publishingPlatforms.bookId, bookId),
        eq(publishingPlatforms.platformCode, platformCode)
      )
    )
    .returning();

  return result[0] ?? null;
}

/** Update platform status */
export async function updatePlatformStatus(
  bookId: string,
  platformCode: string,
  status: string,
  notes?: string
) {
  const set: Record<string, unknown> = { status };
  if (status === "published") set.publishedAt = new Date();
  if (notes !== undefined) set.notes = notes;

  const result = await db
    .update(publishingPlatforms)
    .set(set)
    .where(
      and(
        eq(publishingPlatforms.bookId, bookId),
        eq(publishingPlatforms.platformCode, platformCode)
      )
    )
    .returning();

  return result[0] ?? null;
}

/** Initialize default platforms for a book */
export async function initializeDefaultPlatforms(bookId: string) {
  const values = PLATFORM_DEFINITIONS.map((def) => ({
    bookId,
    platformCode: def.code,
    platformName: def.name,
    connected: false,
    status: "draft" as const,
  }));

  await db.insert(publishingPlatforms).values(values).onConflictDoNothing();
}
