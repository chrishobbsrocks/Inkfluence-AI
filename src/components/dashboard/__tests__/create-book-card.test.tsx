import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CreateBookCard } from "../create-book-card";

describe("CreateBookCard", () => {
  it("renders create new book text", () => {
    render(<CreateBookCard onClick={() => {}} />);
    expect(screen.getByText("Create New Book")).toBeInTheDocument();
  });

  it("renders subtitle text", () => {
    render(<CreateBookCard onClick={() => {}} />);
    expect(
      screen.getByText("Start from scratch or template")
    ).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<CreateBookCard onClick={handleClick} />);
    fireEvent.click(screen.getByText("Create New Book"));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
