import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { PreviewTabNav } from "../preview-tab-nav";

describe("PreviewTabNav", () => {
  it("renders all 3 tabs", () => {
    render(<PreviewTabNav activeTab="preview" onTabChange={() => {}} />);
    expect(screen.getByText("Book Preview")).toBeInTheDocument();
    expect(screen.getByText("Cover Design")).toBeInTheDocument();
    expect(screen.getByText("Table of Contents")).toBeInTheDocument();
  });

  it("highlights the active tab", () => {
    render(<PreviewTabNav activeTab="cover" onTabChange={() => {}} />);
    const coverTab = screen.getByText("Cover Design");
    expect(coverTab.className).toContain("font-semibold");
    expect(coverTab.className).toContain("border-stone-900");

    const previewTab = screen.getByText("Book Preview");
    expect(previewTab.className).not.toContain("font-semibold");
  });

  it("calls onTabChange when a tab is clicked", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<PreviewTabNav activeTab="preview" onTabChange={handleChange} />);

    await user.click(screen.getByText("Table of Contents"));
    expect(handleChange).toHaveBeenCalledWith("toc");
  });
});
