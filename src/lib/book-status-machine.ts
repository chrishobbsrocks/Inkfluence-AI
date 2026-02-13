import type { BookStatus } from "@/lib/validations/books";

const VALID_TRANSITIONS: Record<BookStatus, ReadonlySet<BookStatus>> = {
  draft: new Set(["writing"]),
  writing: new Set(["review", "draft"]),
  review: new Set(["published", "draft"]),
  published: new Set(["draft"]),
};

export function isValidTransition(from: BookStatus, to: BookStatus): boolean {
  if (from === to) return true;
  return VALID_TRANSITIONS[from]?.has(to) ?? false;
}

export function getValidNextStatuses(current: BookStatus): BookStatus[] {
  return [...(VALID_TRANSITIONS[current] ?? [])];
}
