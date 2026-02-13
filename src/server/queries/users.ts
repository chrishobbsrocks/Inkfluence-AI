import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { users, type NewUser } from "@/server/db/schema";

export async function getUserByClerkId(clerkId: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  return result[0] ?? null;
}

export async function upsertUser(data: {
  clerkId: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
}) {
  const existing = await getUserByClerkId(data.clerkId);

  if (existing) {
    const result = await db
      .update(users)
      .set({
        email: data.email,
        name: data.name ?? existing.name,
        avatarUrl: data.avatarUrl ?? existing.avatarUrl,
      })
      .where(eq(users.clerkId, data.clerkId))
      .returning();
    return result[0]!;
  }

  const newUser: NewUser = {
    clerkId: data.clerkId,
    email: data.email,
    name: data.name,
    avatarUrl: data.avatarUrl,
  };

  const result = await db.insert(users).values(newUser).returning();
  return result[0]!;
}
