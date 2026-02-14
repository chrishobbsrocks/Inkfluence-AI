import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { TableOfContentsTab } from "../table-of-contents-tab";
import type { PreviewChapter } from "@/types/preview";

const mockChapters: PreviewChapter[] = [
  { id: "ch-1", title: "Introduction", content: null, orderIndex: 0, wordCount: 500 },
  { id: "ch-2", title: "Getting Started", content: null, orderIndex: 1, wordCount: 1250 },
  { id: "ch-3", title: "Advanced Topics", content: null, orderIndex: 2, wordCount: 0 },
];

describe("TableOfContentsTab", () => {
  it("renders the book title", () => {
    render(
      <TableOfContentsTab
        bookTitle="My Test Book"
        chapters={mockChapters}
        onChapterSelect={() => {}}
      />
    );
    expect(screen.getByText("My Test Book")).toBeInTheDocument();
  });

  it("renders Table of Contents heading", () => {
    render(
      <TableOfContentsTab
        bookTitle="My Test Book"
        chapters={mockChapters}
        onChapterSelect={() => {}}
      />
    );
    expect(screen.getByText("Table of Contents")).toBeInTheDocument();
  });

  it("renders all chapter titles", () => {
    render(
      <TableOfContentsTab
        bookTitle="My Test Book"
        chapters={mockChapters}
        onChapterSelect={() => {}}
      />
    );
    expect(screen.getByText("Introduction")).toBeInTheDocument();
    expect(screen.getByText("Getting Started")).toBeInTheDocument();
    expect(screen.getByText("Advanced Topics")).toBeInTheDocument();
  });

  it("calls onChapterSelect when a chapter is clicked", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    render(
      <TableOfContentsTab
        bookTitle="My Test Book"
        chapters={mockChapters}
        onChapterSelect={handleSelect}
      />
    );

    await user.click(screen.getByText("Getting Started"));
    expect(handleSelect).toHaveBeenCalledWith(1);
  });

  it("shows empty state for no chapters", () => {
    render(
      <TableOfContentsTab
        bookTitle="My Test Book"
        chapters={[]}
        onChapterSelect={() => {}}
      />
    );
    expect(screen.getByText("No chapters yet.")).toBeInTheDocument();
  });

  it("shows page estimates for chapters with words", () => {
    render(
      <TableOfContentsTab
        bookTitle="My Test Book"
        chapters={mockChapters}
        onChapterSelect={() => {}}
      />
    );
    // 500 words / 250 = 2 pages
    expect(screen.getByText("2p")).toBeInTheDocument();
    // 1250 words / 250 = 5 pages
    expect(screen.getByText("5p")).toBeInTheDocument();
  });
});
