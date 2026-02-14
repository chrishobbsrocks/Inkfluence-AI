import type { BookMetadata } from "@/server/db/schema/book-metadata";
import type { PlatformCode } from "@/types/publishing-platform";

export interface PlatformMetadataJson {
  platform: string;
  title: string;
  author: string;
  description: string | null;
  keywords: string[];
  category: string | null;
  price: string;
  language: string;
  publisher: string;
  generatedAt: string;
}

export function buildPlatformMetadataJson(
  book: { title: string; authorName?: string | null },
  metadata: BookMetadata | null,
  platformCode: PlatformCode
): PlatformMetadataJson {
  return {
    platform: platformCode,
    title: book.title,
    author: book.authorName ?? "Unknown Author",
    description: metadata?.description ?? null,
    keywords: metadata?.keywords ?? [],
    category: metadata?.category ?? null,
    price: metadata?.price ?? "9.99",
    language: "en",
    publisher: "Inkfluence AI",
    generatedAt: new Date().toISOString(),
  };
}
