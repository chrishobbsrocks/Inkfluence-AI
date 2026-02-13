import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SidebarSection } from "../sidebar-section";

describe("SidebarSection", () => {
  it("renders the label in uppercase", () => {
    render(<SidebarSection label="Tools" />);
    const label = screen.getByText("Tools");
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass("uppercase");
  });
});
