import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BookCard } from "../book-card";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/dashboard"),
}));

const mockBook = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  userId: "user-123",
  title: "My Test Book",
  description: "A test book",
  status: "draft" as const,
  coverUrl: null,
  wordCount: 5000,
  chapterCount: 3,
  createdAt: new Date("2026-01-15"),
  updatedAt: new Date("2026-02-10"),
  deletedAt: null,
};

describe("BookCard", () => {
  it("renders book title", () => {
    render(<BookCard book={mockBook} />);
    expect(screen.getByText("My Test Book")).toBeInTheDocument();
  });

  it("renders chapter count and word count", () => {
    render(<BookCard book={mockBook} />);
    expect(screen.getByText(/3 chapters/)).toBeInTheDocument();
    expect(screen.getByText(/5,000 words/)).toBeInTheDocument();
  });

  it("links to book outline page", () => {
    render(<BookCard book={mockBook} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute(
      "href",
      "/books/550e8400-e29b-41d4-a716-446655440000/outline"
    );
  });

  it("shows status badge", () => {
    render(<BookCard book={mockBook} />);
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  it("shows progress bar for non-published books", () => {
    const { container } = render(<BookCard book={mockBook} />);
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toBeInTheDocument();
  });

  it("does NOT show progress bar for published books", () => {
    const publishedBook = { ...mockBook, status: "published" as const };
    const { container } = render(<BookCard book={publishedBook} />);
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).not.toBeInTheDocument();
  });

  it("applies dark badge for published status", () => {
    const publishedBook = { ...mockBook, status: "published" as const };
    render(<BookCard book={publishedBook} />);
    const badge = screen.getByText("Published");
    expect(badge).toHaveClass("bg-stone-900");
  });

  it("formats date correctly", () => {
    render(<BookCard book={mockBook} />);
    // Date formatting depends on timezone, so check for the month prefix
    const dateSpan = screen.getByText(/^Feb \d+$/);
    expect(dateSpan).toBeInTheDocument();
  });
});
