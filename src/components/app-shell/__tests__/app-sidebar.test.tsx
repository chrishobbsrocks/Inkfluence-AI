import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AppSidebar } from "../app-sidebar";
import { BookContextProvider, BookContextSetter } from "../book-context";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/dashboard"),
}));

vi.mock("@clerk/nextjs", () => ({
  useUser: () => ({
    isLoaded: true,
    user: { firstName: "Test", lastName: "User", imageUrl: null },
  }),
}));

describe("AppSidebar", () => {
  it("renders global nav when no book context", () => {
    render(
      <BookContextProvider>
        <AppSidebar />
      </BookContextProvider>
    );
    expect(screen.getByText("Templates")).toBeInTheDocument();
    expect(screen.getByText("Lead Magnets")).toBeInTheDocument();
  });

  it("renders book nav when book context is set", () => {
    render(
      <BookContextProvider>
        <BookContextSetter bookId="abc123" bookTitle="My Book" />
        <AppSidebar />
      </BookContextProvider>
    );
    expect(screen.getByText("Outline")).toBeInTheDocument();
    expect(screen.getByText("Chapters")).toBeInTheDocument();
  });

  it("renders the logo", () => {
    render(
      <BookContextProvider>
        <AppSidebar />
      </BookContextProvider>
    );
    expect(screen.getByText(/Inkfluence/)).toBeInTheDocument();
  });

  it("renders the user profile", () => {
    render(
      <BookContextProvider>
        <AppSidebar />
      </BookContextProvider>
    );
    expect(screen.getByText("Test User")).toBeInTheDocument();
  });
});
