import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BookGrid } from "../book-grid";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/dashboard"),
}));

const mockBooks = [
  {
    id: "book-1",
    userId: "user-1",
    title: "First Book",
    description: null,
    status: "draft" as const,
    coverUrl: null,
    wordCount: 1000,
    chapterCount: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
  {
    id: "book-2",
    userId: "user-1",
    title: "Second Book",
    description: null,
    status: "writing" as const,
    coverUrl: null,
    wordCount: 3000,
    chapterCount: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
];

describe("BookGrid", () => {
  it("renders all book cards", () => {
    render(<BookGrid books={mockBooks} onCreateClick={() => {}} />);
    expect(screen.getByText("First Book")).toBeInTheDocument();
    expect(screen.getByText("Second Book")).toBeInTheDocument();
  });

  it("renders the create book card at the end", () => {
    render(<BookGrid books={mockBooks} onCreateClick={() => {}} />);
    expect(screen.getByText("Create New Book")).toBeInTheDocument();
  });

  it("renders create card even with no books", () => {
    render(<BookGrid books={[]} onCreateClick={() => {}} />);
    expect(screen.getByText("Create New Book")).toBeInTheDocument();
  });
});
