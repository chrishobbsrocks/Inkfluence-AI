import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { SidebarNavBook } from "../sidebar-nav-book";
import { BookContextProvider, BookContextSetter } from "../book-context";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/books/abc123/outline"),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

const mockChapters = [
  { id: "ch1", title: "Introduction", orderIndex: 0, status: "outline" },
  { id: "ch2", title: "Main Points", orderIndex: 1, status: "writing" },
  { id: "ch3", title: "Conclusion", orderIndex: 2, status: "complete" },
];

function renderWithBook(chapters: typeof mockChapters = []) {
  return render(
    <BookContextProvider>
      <BookContextSetter
        bookId="abc123"
        bookTitle="Test Book"
        chapters={chapters}
      />
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

  it("links Outline to correct book route", () => {
    renderWithBook();
    expect(screen.getByRole("link", { name: /Outline/ })).toHaveAttribute(
      "href",
      "/books/abc123/outline"
    );
  });

  it("renders Chapters as collapsible trigger", () => {
    renderWithBook();
    expect(
      screen.getByRole("button", { name: /Chapters/ })
    ).toBeInTheDocument();
  });

  it("shows chapter list when expanded", async () => {
    const user = userEvent.setup();
    renderWithBook(mockChapters);

    // Click to expand
    await user.click(screen.getByRole("button", { name: /Chapters/ }));

    expect(screen.getByText("1. Introduction")).toBeInTheDocument();
    expect(screen.getByText("2. Main Points")).toBeInTheDocument();
    expect(screen.getByText("3. Conclusion")).toBeInTheDocument();
  });

  it("shows empty state when no chapters", async () => {
    const user = userEvent.setup();
    renderWithBook([]);

    await user.click(screen.getByRole("button", { name: /Chapters/ }));

    expect(screen.getByText("No chapters yet")).toBeInTheDocument();
  });

  it("links chapters to editor with chapter param", async () => {
    const user = userEvent.setup();
    renderWithBook(mockChapters);

    await user.click(screen.getByRole("button", { name: /Chapters/ }));

    const introLink = screen.getByRole("link", { name: /Introduction/ });
    expect(introLink).toHaveAttribute(
      "href",
      "/books/abc123/editor?chapter=ch1"
    );
  });
});
