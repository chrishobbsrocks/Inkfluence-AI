import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { LayoutDashboard } from "lucide-react";
import { SidebarItem } from "../sidebar-item";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/dashboard"),
}));

describe("SidebarItem", () => {
  it("renders a link with label and icon", () => {
    render(
      <SidebarItem href="/dashboard" icon={LayoutDashboard} label="My Books" />
    );
    const link = screen.getByRole("link", { name: /My Books/ });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/dashboard");
  });

  it("applies active styles when pathname matches", () => {
    render(
      <SidebarItem href="/dashboard" icon={LayoutDashboard} label="My Books" />
    );
    const link = screen.getByRole("link", { name: /My Books/ });
    expect(link).toHaveClass("bg-white");
    expect(link).toHaveClass("font-semibold");
  });

  it("applies inactive styles when pathname does not match", () => {
    render(
      <SidebarItem
        href="/templates"
        icon={LayoutDashboard}
        label="Templates"
      />
    );
    const link = screen.getByRole("link", { name: /Templates/ });
    expect(link).toHaveClass("text-stone-500");
    expect(link).not.toHaveClass("bg-white");
  });
});
