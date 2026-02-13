import { config } from "dotenv";

// Load env files — dotenv won't override existing vars (Docker sets them via env_file)
config({ path: ".env.local" });
config({ path: ".env.docker" });

import { getDb } from "@/server/db";
import {
  users,
  books,
  chapters,
  outlines,
  outlineSections,
} from "@/server/db/schema";

async function seed() {
  console.log("Seeding database...");
  const db = getDb();

  // Create test user
  const [testUser] = await db
    .insert(users)
    .values({
      clerkId: "user_seed_001",
      email: "dev@inkfluence.test",
      name: "Dev User",
      plan: "professional",
    })
    .onConflictDoNothing({ target: users.clerkId })
    .returning();

  if (!testUser) {
    console.log("Seed data already exists, skipping.");
    process.exit(0);
  }

  // Create sample books
  const [draftBook] = await db
    .insert(books)
    .values({
      userId: testUser.id,
      title: "The Art of AI Writing",
      description: "A comprehensive guide to leveraging AI for book creation.",
      status: "draft",
      wordCount: 0,
      chapterCount: 3,
    })
    .returning();

  const [writingBook] = await db
    .insert(books)
    .values({
      userId: testUser.id,
      title: "Modern TypeScript Patterns",
      description: "Advanced TypeScript patterns for production applications.",
      status: "writing",
      wordCount: 5200,
      chapterCount: 5,
    })
    .returning();

  await db.insert(books).values({
    userId: testUser.id,
    title: "Docker for Developers",
    description: "A practical guide to Docker in development workflows.",
    status: "published",
    wordCount: 32000,
    chapterCount: 8,
  });

  // Create chapters for the writing book
  await db.insert(chapters).values([
    {
      bookId: writingBook.id,
      title: "Introduction to Type Safety",
      content: "TypeScript brings type safety to JavaScript...",
      orderIndex: 0,
      wordCount: 1200,
      status: "complete",
    },
    {
      bookId: writingBook.id,
      title: "Advanced Generics",
      content: "Generics allow you to write reusable, type-safe code...",
      orderIndex: 1,
      wordCount: 2000,
      status: "writing",
    },
    {
      bookId: writingBook.id,
      title: "Discriminated Unions",
      content: null,
      orderIndex: 2,
      wordCount: 0,
      status: "outline",
    },
  ]);

  // Create an outline for the draft book
  const [outline] = await db
    .insert(outlines)
    .values({
      bookId: draftBook.id,
      topic: "Using AI tools for creative writing",
      audience: "Authors and content creators",
      expertiseLevel: "intermediate",
    })
    .returning();

  // Create outline sections
  await db.insert(outlineSections).values([
    {
      outlineId: outline.id,
      chapterTitle: "What is AI-Assisted Writing?",
      keyPoints: ["Definition", "History", "Current landscape"],
      orderIndex: 0,
      aiSuggested: true,
    },
    {
      outlineId: outline.id,
      chapterTitle: "Choosing the Right AI Tool",
      keyPoints: ["Comparison criteria", "Popular tools", "Cost analysis"],
      orderIndex: 1,
      aiSuggested: true,
    },
    {
      outlineId: outline.id,
      chapterTitle: "Workflow Integration",
      keyPoints: ["Daily workflow", "Editing process", "Quality control"],
      orderIndex: 2,
      aiSuggested: false,
    },
  ]);

  console.log("Seed complete:");
  console.log("  - 1 user created");
  console.log("  - 3 books created (draft, writing, published)");
  console.log("  - 3 chapters created");
  console.log("  - 1 outline with 3 sections created");

  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
