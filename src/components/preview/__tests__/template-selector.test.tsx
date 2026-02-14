import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { TemplateSelector } from "../template-selector";
import { BOOK_TEMPLATES } from "@/lib/templates";

describe("TemplateSelector", () => {
  it("renders all 4 templates", () => {
    render(
      <TemplateSelector
        templates={BOOK_TEMPLATES}
        selectedId="modern"
        onSelect={() => {}}
      />
    );
    expect(screen.getAllByText("Modern")).toHaveLength(2); // thumbnail + label
    expect(screen.getAllByText("Classic")).toHaveLength(2);
    expect(screen.getAllByText("Minimal")).toHaveLength(2);
    expect(screen.getAllByText("Bold")).toHaveLength(2);
  });

  it("calls onSelect when a template is clicked", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    render(
      <TemplateSelector
        templates={BOOK_TEMPLATES}
        selectedId="modern"
        onSelect={handleSelect}
      />
    );

    await user.click(screen.getAllByText("Classic")[0]!);
    expect(handleSelect).toHaveBeenCalledWith("classic");
  });

  it("highlights the selected template", () => {
    const { container } = render(
      <TemplateSelector
        templates={BOOK_TEMPLATES}
        selectedId="classic"
        onSelect={() => {}}
      />
    );

    const buttons = container.querySelectorAll("button");
    // Classic is the second template (index 1)
    expect(buttons[1]?.className).toContain("border-stone-900");
    // Modern (index 0) should not have the selected border
    expect(buttons[0]?.className).not.toContain("border-stone-900");
  });
});
