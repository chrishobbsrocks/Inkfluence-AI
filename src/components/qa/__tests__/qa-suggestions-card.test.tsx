import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { QASuggestionsCard } from "../qa-suggestions-card";
import type { QASuggestion } from "@/types/qa-analysis";

const mockSuggestions: QASuggestion[] = [
  {
    id: "s-1",
    chapterId: "ch-1",
    chapterTitle: "Introduction",
    dimension: "consistency",
    severity: "major",
    issueText: "Inconsistent terminology",
    explanation: 'Uses "churn" and "attrition" interchangeably',
    location: null,
    autoFixable: true,
    suggestedFix: "churn rate",
  },
  {
    id: "s-2",
    chapterId: "ch-2",
    chapterTitle: "Deep Dive",
    dimension: "readability",
    severity: "minor",
    issueText: "Passive voice detected",
    explanation: "12 sentences use passive voice",
    location: null,
    autoFixable: true,
    suggestedFix: "active voice version",
  },
  {
    id: "s-3",
    chapterId: "ch-2",
    chapterTitle: "Deep Dive",
    dimension: "structure",
    severity: "critical",
    issueText: "Missing conclusion",
    explanation: "Chapter lacks a summary paragraph",
    location: null,
    autoFixable: false,
    suggestedFix: null,
  },
];

describe("QASuggestionsCard", () => {
  const defaultProps = {
    suggestions: mockSuggestions,
    selectedChapterId: null,
    fixingIds: new Set<string>(),
    fixedIds: new Set<string>(),
    onFix: vi.fn(),
  };

  it("renders suggestion count badge", () => {
    render(<QASuggestionsCard {...defaultProps} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders all suggestion items", () => {
    render(<QASuggestionsCard {...defaultProps} />);
    expect(screen.getByText("Inconsistent terminology")).toBeInTheDocument();
    expect(screen.getByText("Passive voice detected")).toBeInTheDocument();
    expect(screen.getByText("Missing conclusion")).toBeInTheDocument();
  });

  it("renders severity badges", () => {
    render(<QASuggestionsCard {...defaultProps} />);
    expect(screen.getByText("major")).toBeInTheDocument();
    expect(screen.getByText("minor")).toBeInTheDocument();
    expect(screen.getByText("critical")).toBeInTheDocument();
  });

  it("renders Auto-fix buttons for fixable suggestions", () => {
    render(<QASuggestionsCard {...defaultProps} />);
    const autoFixButtons = screen.getAllByRole("button", { name: /Auto-fix/i });
    expect(autoFixButtons).toHaveLength(2);
  });

  it("does not render Auto-fix for non-fixable suggestions", () => {
    render(<QASuggestionsCard {...defaultProps} />);
    // Only 2 Auto-fix buttons, not 3
    const autoFixButtons = screen.getAllByRole("button", { name: /Auto-fix/i });
    expect(autoFixButtons).toHaveLength(2);
  });

  it("calls onFix when Auto-fix is clicked", async () => {
    const user = userEvent.setup();
    const onFix = vi.fn();
    render(<QASuggestionsCard {...defaultProps} onFix={onFix} />);

    const autoFixButtons = screen.getAllByRole("button", { name: /Auto-fix/i });
    await user.click(autoFixButtons[0]!);

    expect(onFix).toHaveBeenCalledWith(mockSuggestions[0]);
  });

  it("shows Fixed state for fixed suggestions", () => {
    render(
      <QASuggestionsCard
        {...defaultProps}
        fixedIds={new Set(["s-1"])}
      />
    );
    expect(screen.getByText("Fixed")).toBeInTheDocument();
    // Only 1 remaining Auto-fix button (s-2)
    const autoFixButtons = screen.getAllByRole("button", { name: /Auto-fix/i });
    expect(autoFixButtons).toHaveLength(1);
  });

  it("disables Auto-fix button when fixing", () => {
    render(
      <QASuggestionsCard
        {...defaultProps}
        fixingIds={new Set(["s-1"])}
      />
    );
    const autoFixButtons = screen.getAllByRole("button", { name: /Auto-fix/i });
    // First button (s-1) should be disabled
    expect(autoFixButtons[0]).toBeDisabled();
  });

  it("filters suggestions by chapter when selectedChapterId is set", () => {
    render(
      <QASuggestionsCard {...defaultProps} selectedChapterId="ch-2" />
    );
    // ch-2 has 2 suggestions
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Passive voice detected")).toBeInTheDocument();
    expect(screen.getByText("Missing conclusion")).toBeInTheDocument();
    // ch-1 suggestion should not appear
    expect(
      screen.queryByText("Inconsistent terminology")
    ).not.toBeInTheDocument();
  });

  it("shows empty message when no suggestions match filter", () => {
    render(
      <QASuggestionsCard
        {...defaultProps}
        suggestions={[]}
      />
    );
    expect(screen.getByText(/No suggestions/)).toBeInTheDocument();
  });

  it("shows Chapter Suggestions title when filtered", () => {
    render(
      <QASuggestionsCard {...defaultProps} selectedChapterId="ch-1" />
    );
    expect(screen.getByText("Chapter Suggestions")).toBeInTheDocument();
  });

  it("shows Top Suggestions title when not filtered", () => {
    render(<QASuggestionsCard {...defaultProps} />);
    expect(screen.getByText("Top Suggestions")).toBeInTheDocument();
  });
});
