import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SidebarNavBook } from "../sidebar-nav-book";
import { BookContextProvider, BookContextSetter } from "../book-context";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/books/abc123/outline"),
}));

function renderWithBook() {
  return render(
    <BookContextProvider>
      <BookContextSetter bookId="abc123" bookTitle="Test Book" />
      <SidebarNavBook />
    </BookContextProvider>
  );
}

describe("SidebarNavBook", () => {
  it("renders the back link", () => {
    renderWithBook();
    expect(screen.getByText("My Books")).toBeInTheDocument();
  });

  it("renders the book title section", () => {
    renderWithBook();
    expect(screen.getByText("Test Book")).toBeInTheDocument();
  });

  it("renders all book nav items", () => {
    renderWithBook();
    expect(screen.getByText("Outline")).toBeInTheDocument();
    expect(screen.getByText("Chapters")).toBeInTheDocument();
    expect(screen.getByText("Quality Review")).toBeInTheDocument();
    expect(screen.getByText("Reviews")).toBeInTheDocument();
    expect(screen.getByText("Preview")).toBeInTheDocument();
    expect(screen.getByText("Publish")).toBeInTheDocument();
  });

  it("links to correct book routes", () => {
    renderWithBook();
    expect(screen.getByRole("link", { name: /Outline/ })).toHaveAttribute(
      "href",
      "/books/abc123/outline"
    );
    expect(screen.getByRole("link", { name: /Chapters/ })).toHaveAttribute(
      "href",
      "/books/abc123/editor"
    );
  });
});
