import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DashboardSkeleton } from "../dashboard-skeleton";

describe("DashboardSkeleton", () => {
  it("renders the header", () => {
    render(<DashboardSkeleton />);
    expect(screen.getByText("My Books")).toBeInTheDocument();
  });

  it("renders skeleton elements", () => {
    const { container } = render(<DashboardSkeleton />);
    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
