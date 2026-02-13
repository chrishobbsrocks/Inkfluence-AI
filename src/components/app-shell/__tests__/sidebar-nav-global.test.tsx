import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SidebarNavGlobal } from "../sidebar-nav-global";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/dashboard"),
}));

describe("SidebarNavGlobal", () => {
  it("renders all global nav items", () => {
    render(<SidebarNavGlobal />);
    expect(screen.getByText("My Books")).toBeInTheDocument();
    expect(screen.getByText("Templates")).toBeInTheDocument();
    expect(screen.getByText("Lead Magnets")).toBeInTheDocument();
    expect(screen.getByText("Analytics")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Help & Support")).toBeInTheDocument();
  });

  it("renders section labels", () => {
    render(<SidebarNavGlobal />);
    expect(screen.getByText("Tools")).toBeInTheDocument();
    expect(screen.getByText("Account")).toBeInTheDocument();
  });
});
