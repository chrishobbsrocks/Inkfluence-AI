import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { AddChapterButton } from "../add-chapter-button";

describe("AddChapterButton", () => {
  it("renders add new chapter text", () => {
    render(<AddChapterButton onClick={() => {}} />);
    expect(screen.getByText("Add new chapter...")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<AddChapterButton onClick={handleClick} />);

    await user.click(screen.getByText("Add new chapter..."));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
