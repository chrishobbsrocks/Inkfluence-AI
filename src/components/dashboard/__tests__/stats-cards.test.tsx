import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StatsCards } from "../stats-cards";

const mockStats = {
  totalBooks: 12,
  publishedCount: 3,
  writingCount: 4,
  draftCount: 3,
  reviewCount: 2,
};

describe("StatsCards", () => {
  it("renders 4 stat cards", () => {
    render(<StatsCards stats={mockStats} />);
    expect(screen.getByText("Total Books")).toBeInTheDocument();
    expect(screen.getByText("Published")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Downloads")).toBeInTheDocument();
  });

  it("shows correct total books count", () => {
    render(<StatsCards stats={mockStats} />);
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("shows correct published count", () => {
    render(<StatsCards stats={mockStats} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("calculates in progress as draft + writing + review", () => {
    render(<StatsCards stats={mockStats} />);
    // 4 + 3 + 2 = 9
    expect(screen.getByText("9")).toBeInTheDocument();
  });

  it("shows 0 for downloads placeholder", () => {
    render(<StatsCards stats={mockStats} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("handles zero values", () => {
    render(
      <StatsCards
        stats={{
          totalBooks: 0,
          publishedCount: 0,
          writingCount: 0,
          draftCount: 0,
          reviewCount: 0,
        }}
      />
    );
    const zeros = screen.getAllByText("0");
    expect(zeros.length).toBeGreaterThanOrEqual(4);
  });
});
