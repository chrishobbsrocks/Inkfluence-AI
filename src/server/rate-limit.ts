import { eq, and } from "drizzle-orm";
import { db } from "@/server/db";
import { rateLimits } from "@/server/db/schema";

interface RateLimitConfig {
  endpoint: string;
  maxRequests: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number | null;
}

/** Get the start of the current hourly window (floor to hour boundary) */
export function getCurrentWindowStart(): Date {
  const now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    0,
    0,
    0
  );
}

/** Check rate limit and increment counter if allowed */
export async function checkAndIncrementRateLimit(
  userId: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const windowStart = getCurrentWindowStart();

  // Try to find existing record for this window
  const existing = await db
    .select()
    .from(rateLimits)
    .where(
      and(
        eq(rateLimits.userId, userId),
        eq(rateLimits.endpoint, config.endpoint),
        eq(rateLimits.windowStart, windowStart)
      )
    )
    .limit(1);

  const currentCount = existing[0]?.requestCount ?? 0;

  if (currentCount >= config.maxRequests) {
    // Calculate seconds until next window
    const nextWindow = new Date(windowStart.getTime() + 60 * 60 * 1000);
    const retryAfterSeconds = Math.ceil(
      (nextWindow.getTime() - Date.now()) / 1000
    );

    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  // Upsert: increment count or insert new record
  if (existing[0]) {
    await db
      .update(rateLimits)
      .set({ requestCount: currentCount + 1 })
      .where(eq(rateLimits.id, existing[0].id));
  } else {
    await db.insert(rateLimits).values({
      userId,
      endpoint: config.endpoint,
      windowStart,
      requestCount: 1,
    });
  }

  return {
    allowed: true,
    remaining: config.maxRequests - currentCount - 1,
    retryAfterSeconds: null,
  };
}

/** Rate limit configurations for AI endpoints */
export const AI_RATE_LIMITS = {
  chapterGeneration: {
    endpoint: "ai/generate/chapter",
    maxRequests: 10,
  },
  chat: {
    endpoint: "ai/chat",
    maxRequests: 50,
  },
} as const;
