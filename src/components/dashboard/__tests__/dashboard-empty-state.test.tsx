import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DashboardEmptyState } from "../dashboard-empty-state";

describe("DashboardEmptyState", () => {
  it("renders empty state message", () => {
    render(<DashboardEmptyState onCreateClick={() => {}} />);
    expect(screen.getByText("No books yet")).toBeInTheDocument();
    expect(
      screen.getByText("Create your first book to get started")
    ).toBeInTheDocument();
  });

  it("renders CTA button", () => {
    render(<DashboardEmptyState onCreateClick={() => {}} />);
    expect(
      screen.getByRole("button", { name: /Create Your First Book/ })
    ).toBeInTheDocument();
  });

  it("calls onCreateClick when CTA is clicked", () => {
    const handleClick = vi.fn();
    render(<DashboardEmptyState onCreateClick={handleClick} />);
    fireEvent.click(
      screen.getByRole("button", { name: /Create Your First Book/ })
    );
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
