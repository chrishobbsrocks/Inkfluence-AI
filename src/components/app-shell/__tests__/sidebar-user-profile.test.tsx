import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SidebarUserProfile } from "../sidebar-user-profile";

const mockUseUser = vi.fn();

vi.mock("@clerk/nextjs", () => ({
  useUser: () => mockUseUser(),
}));

describe("SidebarUserProfile", () => {
  it("shows loading skeleton when not loaded", () => {
    mockUseUser.mockReturnValue({ isLoaded: false, user: null });
    const { container } = render(<SidebarUserProfile />);
    const pulses = container.querySelectorAll(".animate-pulse");
    expect(pulses.length).toBeGreaterThan(0);
  });

  it("shows user name and plan when loaded", () => {
    mockUseUser.mockReturnValue({
      isLoaded: true,
      user: {
        firstName: "Jane",
        lastName: "Doe",
        imageUrl: null,
      },
    });
    render(<SidebarUserProfile />);
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("Free Plan")).toBeInTheDocument();
  });

  it("shows initials when no image URL", () => {
    mockUseUser.mockReturnValue({
      isLoaded: true,
      user: {
        firstName: "Jane",
        lastName: "Doe",
        imageUrl: null,
      },
    });
    render(<SidebarUserProfile />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("shows user image when imageUrl exists", () => {
    mockUseUser.mockReturnValue({
      isLoaded: true,
      user: {
        firstName: "Jane",
        lastName: "Doe",
        imageUrl: "https://example.com/avatar.jpg",
      },
    });
    render(<SidebarUserProfile />);
    const img = screen.getByAltText("Jane Doe");
    expect(img).toHaveAttribute("src", "https://example.com/avatar.jpg");
  });
});
