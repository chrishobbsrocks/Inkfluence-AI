import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { GapSuggestionMessage } from "../gap-suggestion-message";

describe("GapSuggestionMessage", () => {
  const defaultProps = {
    content: "I noticed you haven't covered pricing strategies.",
    gapArea: "Pricing",
    onAccept: vi.fn(),
    onSkip: vi.fn(),
  };

  it("renders message content", () => {
    render(<GapSuggestionMessage {...defaultProps} />);
    expect(
      screen.getByText("I noticed you haven't covered pricing strategies.")
    ).toBeInTheDocument();
  });

  it("renders accept and skip buttons", () => {
    render(<GapSuggestionMessage {...defaultProps} />);
    expect(screen.getByText("Yes, add it")).toBeInTheDocument();
    expect(screen.getByText('Skip "Pricing"')).toBeInTheDocument();
  });

  it("calls onAccept when accept button clicked", () => {
    const onAccept = vi.fn();
    render(<GapSuggestionMessage {...defaultProps} onAccept={onAccept} />);
    fireEvent.click(screen.getByText("Yes, add it"));
    expect(onAccept).toHaveBeenCalledTimes(1);
  });

  it("calls onSkip when skip button clicked", () => {
    const onSkip = vi.fn();
    render(<GapSuggestionMessage {...defaultProps} onSkip={onSkip} />);
    fireEvent.click(screen.getByText('Skip "Pricing"'));
    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  it("disables buttons when disabled prop is true", () => {
    render(<GapSuggestionMessage {...defaultProps} disabled />);
    expect(screen.getByText("Yes, add it")).toBeDisabled();
    expect(screen.getByText('Skip "Pricing"')).toBeDisabled();
  });
});
