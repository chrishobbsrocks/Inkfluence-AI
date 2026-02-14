import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { PreviewWrapper } from "../preview-wrapper";
import type { PreviewChapter } from "@/types/preview";

// Mock next/link to render as an anchor
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const mockChapters: PreviewChapter[] = [
  {
    id: "ch-1",
    title: "Introduction",
    content: "<p>Hello world.</p>",
    orderIndex: 0,
    wordCount: 100,
  },
  {
    id: "ch-2",
    title: "Chapter Two",
    content: "<p>Second chapter.</p>",
    orderIndex: 1,
    wordCount: 200,
  },
];

describe("PreviewWrapper", () => {
  it("renders header with Preview & Format title", () => {
    render(
      <PreviewWrapper
        bookId="book-1"
        bookTitle="Test Book"
        chapters={mockChapters}
      />
    );
    expect(screen.getByText("Preview & Format")).toBeInTheDocument();
  });

  it("renders Proceed to Publish link", () => {
    render(
      <PreviewWrapper
        bookId="book-1"
        bookTitle="Test Book"
        chapters={mockChapters}
      />
    );
    const link = screen.getByText(/Proceed to Publish/);
    expect(link.closest("a")).toHaveAttribute("href", "/books/book-1/publish");
  });

  it("shows Book Preview tab by default", () => {
    render(
      <PreviewWrapper
        bookId="book-1"
        bookTitle="Test Book"
        chapters={mockChapters}
      />
    );
    // First chapter should be visible
    expect(screen.getByText("Introduction")).toBeInTheDocument();
    expect(screen.getByText("Hello world.")).toBeInTheDocument();
  });

  it("switches to Cover Design tab", async () => {
    const user = userEvent.setup();
    render(
      <PreviewWrapper
        bookId="book-1"
        bookTitle="Test Book"
        chapters={mockChapters}
      />
    );

    await user.click(screen.getByRole("button", { name: "Cover Design" }));
    expect(screen.getByText("Coming in a future update")).toBeInTheDocument();
  });

  it("switches to Table of Contents tab", async () => {
    const user = userEvent.setup();
    render(
      <PreviewWrapper
        bookId="book-1"
        bookTitle="Test Book"
        chapters={mockChapters}
      />
    );

    await user.click(screen.getByText("Table of Contents"));
    // Both chapters should be listed
    expect(screen.getByText("Introduction")).toBeInTheDocument();
    expect(screen.getByText("Chapter Two")).toBeInTheDocument();
  });

  it("navigates to chapter from TOC and switches to preview", async () => {
    const user = userEvent.setup();
    render(
      <PreviewWrapper
        bookId="book-1"
        bookTitle="Test Book"
        chapters={mockChapters}
      />
    );

    // Go to TOC tab
    await user.click(screen.getByText("Table of Contents"));
    // Click on Chapter Two
    await user.click(screen.getByText("Chapter Two"));
    // Should switch to preview tab showing chapter 2
    expect(screen.getByText("Second chapter.")).toBeInTheDocument();
    expect(screen.getByText("Chapter 2 of 2")).toBeInTheDocument();
  });

  it("switches template via format options panel", async () => {
    const user = userEvent.setup();
    render(
      <PreviewWrapper
        bookId="book-1"
        bookTitle="Test Book"
        chapters={mockChapters}
      />
    );

    // Click on Classic template (the label text, second occurrence of "Classic")
    const classicButtons = screen.getAllByText("Classic");
    await user.click(classicButtons[0]!);

    // Font display should update to Georgia
    expect(screen.getByText("Georgia")).toBeInTheDocument();
  });

  it("renders formatting options panel", () => {
    render(
      <PreviewWrapper
        bookId="book-1"
        bookTitle="Test Book"
        chapters={mockChapters}
      />
    );
    expect(screen.getByText("Formatting Options")).toBeInTheDocument();
    expect(screen.getByText("DM Sans")).toBeInTheDocument();
    expect(screen.getByText("11pt")).toBeInTheDocument();
  });
});
