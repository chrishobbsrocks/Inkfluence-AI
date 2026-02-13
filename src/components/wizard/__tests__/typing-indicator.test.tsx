import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TypingIndicator } from "../typing-indicator";

describe("TypingIndicator", () => {
  it("renders three animated dots", () => {
    const { container } = render(<TypingIndicator />);
    const dots = container.querySelectorAll(".animate-pulse");
    expect(dots).toHaveLength(3);
  });
});
