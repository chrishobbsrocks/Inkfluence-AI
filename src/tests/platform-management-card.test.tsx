import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PlatformManagementCard } from "@/components/publish/platform-management-card";
import type { PlatformCardData } from "@/types/publishing-platform";

const connectedPlatform: PlatformCardData = {
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

const unconnectedPlatform: PlatformCardData = {
  id: null,
  code: "AB",
  name: "Apple Books",
  connected: false,
  selected: false,
  status: "draft",
  submittedAt: null,
  publishedAt: null,
  guidelines: "Upload through Apple Books for Authors",
};

describe("PlatformManagementCard", () => {
  const defaultProps = {
    platforms: [connectedPlatform, unconnectedPlatform],
    onConnect: vi.fn(),
    onDisconnect: vi.fn(),
    onToggleSelect: vi.fn(),
    onStatusChange: vi.fn(),
  };

  it("renders Publishing Platforms title", () => {
    render(<PlatformManagementCard {...defaultProps} />);
    expect(screen.getByText("Publishing Platforms")).toBeInTheDocument();
  });

  it("shows connected count", () => {
    render(<PlatformManagementCard {...defaultProps} />);
    expect(screen.getByText("1 connected")).toBeInTheDocument();
  });

  it("renders connected platforms", () => {
    render(<PlatformManagementCard {...defaultProps} />);
    expect(screen.getByText("Amazon KDP")).toBeInTheDocument();
  });

  it("does not render unconnected platforms in the list", () => {
    render(<PlatformManagementCard {...defaultProps} />);
    // Apple Books should not be rendered as a card, only in the add dropdown
    expect(screen.queryByText("Apple Books")).not.toBeInTheDocument();
  });

  it("shows empty message when no platforms connected", () => {
    render(
      <PlatformManagementCard
        {...defaultProps}
        platforms={[unconnectedPlatform]}
      />
    );
    expect(
      screen.getByText("No platforms connected yet. Add a platform to get started.")
    ).toBeInTheDocument();
  });

  it("renders add platform select when unconnected platforms exist", () => {
    render(<PlatformManagementCard {...defaultProps} />);
    expect(screen.getByText("Add platform...")).toBeInTheDocument();
  });

  it("does not render add select when all platforms connected", () => {
    const allConnected: PlatformCardData[] = [
      connectedPlatform,
      { ...unconnectedPlatform, connected: true },
      {
        id: "plat-3",
        code: "GP",
        name: "Google Play Books",
        connected: true,
        selected: false,
        status: "draft",
        submittedAt: null,
        publishedAt: null,
        guidelines: "Upload via Google Play Books Partner Center",
      },
      {
        id: "plat-4",
        code: "KO",
        name: "Kobo",
        connected: true,
        selected: false,
        status: "draft",
        submittedAt: null,
        publishedAt: null,
        guidelines: "Upload through Kobo Writing Life",
      },
    ];
    render(
      <PlatformManagementCard {...defaultProps} platforms={allConnected} />
    );
    expect(screen.queryByText("Add platform...")).not.toBeInTheDocument();
  });

  it("shows 0 connected when none are connected", () => {
    render(
      <PlatformManagementCard
        {...defaultProps}
        platforms={[unconnectedPlatform]}
      />
    );
    expect(screen.getByText("0 connected")).toBeInTheDocument();
  });
});
