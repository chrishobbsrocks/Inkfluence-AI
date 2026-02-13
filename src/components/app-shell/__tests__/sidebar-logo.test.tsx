import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SidebarLogo } from "../sidebar-logo";

describe("SidebarLogo", () => {
  it("renders the brand name", () => {
    render(<SidebarLogo />);
    expect(screen.getByText(/Inkfluence/)).toBeInTheDocument();
    expect(screen.getByText("AI")).toBeInTheDocument();
  });
});
