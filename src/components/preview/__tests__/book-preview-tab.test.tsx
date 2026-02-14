import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { BookPreviewTab } from "../book-preview-tab";
import { BOOK_TEMPLATES } from "@/lib/templates";
import type { PreviewChapter } from "@/types/preview";

const mockChapters: PreviewChapter[] = [
  {
    id: "ch-1",
    title: "Introduction",
    content: "<p>Welcome to the book.</p>",
    orderIndex: 0,
    wordCount: 100,
  },
  {
    id: "ch-2",
    title: "Getting Started",
    content: "<p>Let us begin.</p>",
    orderIndex: 1,
    wordCount: 250,
  },
];

const modernTemplate = BOOK_TEMPLATES[0]!;

describe("BookPreviewTab", () => {
  it("renders the book title", () => {
    render(
      <BookPreviewTab
        bookTitle="My Test Book"
        chapters={mockChapters}
        template={modernTemplate}
        currentChapterIndex={0}
        onChapterChange={() => {}}
      />
    );
    expect(screen.getByText("My Test Book")).toBeInTheDocument();
  });

  it("renders the current chapter title", () => {
    render(
      <BookPreviewTab
        bookTitle="My Test Book"
        chapters={mockChapters}
        template={modernTemplate}
        currentChapterIndex={0}
        onChapterChange={() => {}}
      />
    );
    expect(screen.getByText("Introduction")).toBeInTheDocument();
  });

  it("renders chapter content", () => {
    render(
      <BookPreviewTab
        bookTitle="My Test Book"
        chapters={mockChapters}
        template={modernTemplate}
        currentChapterIndex={0}
        onChapterChange={() => {}}
      />
    );
    expect(screen.getByText("Welcome to the book.")).toBeInTheDocument();
  });

  it("shows empty state for no chapters", () => {
    render(
      <BookPreviewTab
        bookTitle="My Test Book"
        chapters={[]}
        template={modernTemplate}
        currentChapterIndex={0}
        onChapterChange={() => {}}
      />
    );
    expect(screen.getByText("No chapters to preview.")).toBeInTheDocument();
  });

  it("shows chapter navigation when multiple chapters exist", () => {
    render(
      <BookPreviewTab
        bookTitle="My Test Book"
        chapters={mockChapters}
        template={modernTemplate}
        currentChapterIndex={0}
        onChapterChange={() => {}}
      />
    );
    expect(screen.getByText("Chapter 1 of 2")).toBeInTheDocument();
  });

  it("navigates to next chapter", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <BookPreviewTab
        bookTitle="My Test Book"
        chapters={mockChapters}
        template={modernTemplate}
        currentChapterIndex={0}
        onChapterChange={handleChange}
      />
    );

    await user.click(screen.getByLabelText("Next chapter"));
    expect(handleChange).toHaveBeenCalledWith(1);
  });

  it("handles null content gracefully", () => {
    const chaptersWithNull: PreviewChapter[] = [
      { id: "ch-1", title: "Empty Chapter", content: null, orderIndex: 0, wordCount: 0 },
    ];
    render(
      <BookPreviewTab
        bookTitle="My Test Book"
        chapters={chaptersWithNull}
        template={modernTemplate}
        currentChapterIndex={0}
        onChapterChange={() => {}}
      />
    );
    expect(screen.getByText("No content yet.")).toBeInTheDocument();
  });
});
