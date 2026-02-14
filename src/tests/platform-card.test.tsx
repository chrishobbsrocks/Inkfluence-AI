import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PlatformCard } from "@/components/publish/platform-card";
import type { PlatformCardData } from "@/types/publishing-platform";

const basePlatform: PlatformCardData = {
  id: "plat-1",
  code: "KDP",
  name: "Amazon KDP",
  connected: true,
  selected: false,
  status: "draft",
  submittedAt: null,
  publishedAt: null,
  guidelines: "Upload at kdp.amazon.com",
};

describe("PlatformCard", () => {
  const defaultProps = {
    platform: basePlatform,
    onConnect: vi.fn(),
    onDisconnect: vi.fn(),
    onToggleSelect: vi.fn(),
    onStatusChange: vi.fn(),
  };

  it("renders platform name", () => {
    render(<PlatformCard {...defaultProps} />);
    expect(screen.getByText("Amazon KDP")).toBeInTheDocument();
  });

  it("renders platform code badge", () => {
    render(<PlatformCard {...defaultProps} />);
    expect(screen.getByText("KDP")).toBeInTheDocument();
  });

  it("renders Draft status for draft platform", () => {
    render(<PlatformCard {...defaultProps} />);
    const drafts = screen.getAllByText("Draft");
    expect(drafts.length).toBeGreaterThanOrEqual(1);
  });

  it("renders selection checkbox for connected platform", () => {
    render(<PlatformCard {...defaultProps} />);
    expect(
      screen.getByLabelText("Select Amazon KDP for publishing")
    ).toBeInTheDocument();
  });

  it("renders Remove button for connected platform", () => {
    render(<PlatformCard {...defaultProps} />);
    expect(screen.getByText("Remove")).toBeInTheDocument();
  });

  it("renders Connect button for unconnected platform", () => {
    const unconnected = { ...basePlatform, connected: false };
    render(<PlatformCard {...defaultProps} platform={unconnected} />);
    expect(screen.getByText("Connect")).toBeInTheDocument();
  });

  it("calls onToggleSelect when checkbox clicked", () => {
    const onToggleSelect = vi.fn();
    render(
      <PlatformCard {...defaultProps} onToggleSelect={onToggleSelect} />
    );
    fireEvent.click(screen.getByLabelText("Select Amazon KDP for publishing"));
    expect(onToggleSelect).toHaveBeenCalledWith("KDP");
  });

  it("calls onDisconnect when Remove clicked", () => {
    const onDisconnect = vi.fn();
    render(<PlatformCard {...defaultProps} onDisconnect={onDisconnect} />);
    fireEvent.click(screen.getByText("Remove"));
    expect(onDisconnect).toHaveBeenCalledWith("KDP");
  });

  it("calls onConnect when Connect clicked on unconnected platform", () => {
    const onConnect = vi.fn();
    const unconnected = { ...basePlatform, connected: false };
    render(
      <PlatformCard {...defaultProps} platform={unconnected} onConnect={onConnect} />
    );
    fireEvent.click(screen.getByText("Connect"));
    expect(onConnect).toHaveBeenCalledWith("KDP");
  });

  it("displays submitted date when present", () => {
    const submitted = {
      ...basePlatform,
      status: "submitted" as const,
      submittedAt: "2026-01-15T10:00:00.000Z",
    };
    render(<PlatformCard {...defaultProps} platform={submitted} />);
    // Status badge and date text both exist
    const submittedElements = screen.getAllByText(/Submitted/);
    expect(submittedElements.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(/1\/15\/2026/)).toBeInTheDocument();
  });

  it("disables checkbox when disabled prop is true", () => {
    render(<PlatformCard {...defaultProps} disabled />);
    const checkbox = screen.getByRole("button", {
      name: "Select Amazon KDP for publishing",
    });
    expect(checkbox).toBeDisabled();
  });
});
