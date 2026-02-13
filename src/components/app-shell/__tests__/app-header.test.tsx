import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AppHeader } from "../app-header";

describe("AppHeader", () => {
  it("renders the title", () => {
    render(<AppHeader title="My Books" />);
    expect(screen.getByText("My Books")).toBeInTheDocument();
  });

  it("renders children when provided", () => {
    render(
      <AppHeader title="My Books">
        <button>Action</button>
      </AppHeader>
    );
    expect(screen.getByText("Action")).toBeInTheDocument();
  });

  it("does not render children wrapper when no children", () => {
    const { container } = render(<AppHeader title="Settings" />);
    const header = container.firstChild as HTMLElement;
    // Only the h2 should be a direct child
    expect(header.children).toHaveLength(1);
  });
});
