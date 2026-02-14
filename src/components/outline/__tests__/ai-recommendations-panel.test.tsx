import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AiRecommendationsPanel } from "../ai-recommendations-panel";
import type { OutlineSuggestion, CoverageItem } from "@/types/outline-analysis";

const mockSuggestion: OutlineSuggestion = {
  id: "s1",
  chapterTitle: "Error Handling",
  keyPoints: ["Try/catch", "Custom errors"],
  rationale: "Essential for production code",
  insertAfterIndex: 2,
  priority: "high",
};

const mockCoverage: CoverageItem[] = [
  { area: "Fundamentals", status: "well-covered" },
  { area: "Testing", status: "partial" },
  { area: "Deployment", status: "gap" },
];

const defaultProps = {
  suggestions: [mockSuggestion],
  coverage: mockCoverage,
  overallScore: 72,
  summary: "Good outline with gaps in testing.",
  status: "success" as const,
  error: null,
  onAddSuggestion: vi.fn(),
  onDismiss: vi.fn(),
  onRefresh: vi.fn(),
};

describe("AiRecommendationsPanel", () => {
  it("renders the panel header", () => {
    render(<AiRecommendationsPanel {...defaultProps} />);
    expect(screen.getByText("AI Recommendations")).toBeInTheDocument();
  });

  it("shows the overall completeness score", () => {
    render(<AiRecommendationsPanel {...defaultProps} />);
    expect(screen.getByText("72%")).toBeInTheDocument();
    expect(screen.getByText("Completeness")).toBeInTheDocument();
  });

  it("shows the summary text", () => {
    render(<AiRecommendationsPanel {...defaultProps} />);
    expect(
      screen.getByText("Good outline with gaps in testing.")
    ).toBeInTheDocument();
  });

  it("renders suggestions with title and rationale", () => {
    render(<AiRecommendationsPanel {...defaultProps} />);
    expect(screen.getByText("Error Handling")).toBeInTheDocument();
    expect(
      screen.getByText("Essential for production code")
    ).toBeInTheDocument();
  });

  it("renders coverage items", () => {
    render(<AiRecommendationsPanel {...defaultProps} />);
    expect(screen.getByText("Fundamentals")).toBeInTheDocument();
    expect(screen.getByText("Testing")).toBeInTheDocument();
    expect(screen.getByText("Deployment")).toBeInTheDocument();
  });

  it("calls onAddSuggestion when Add button is clicked", () => {
    const onAdd = vi.fn();
    render(
      <AiRecommendationsPanel {...defaultProps} onAddSuggestion={onAdd} />
    );
    fireEvent.click(screen.getByLabelText("Add Error Handling"));
    expect(onAdd).toHaveBeenCalledWith(mockSuggestion);
  });

  it("calls onDismiss when Dismiss button is clicked", () => {
    const onDismiss = vi.fn();
    render(
      <AiRecommendationsPanel {...defaultProps} onDismiss={onDismiss} />
    );
    fireEvent.click(screen.getByLabelText("Dismiss Error Handling"));
    expect(onDismiss).toHaveBeenCalledWith("s1");
  });

  it("calls onRefresh when refresh button is clicked", () => {
    const onRefresh = vi.fn();
    render(
      <AiRecommendationsPanel {...defaultProps} onRefresh={onRefresh} />
    );
    fireEvent.click(screen.getByLabelText("Refresh analysis"));
    expect(onRefresh).toHaveBeenCalled();
  });

  it("shows loading skeleton when status is loading and no suggestions", () => {
    render(
      <AiRecommendationsPanel
        {...defaultProps}
        status="loading"
        suggestions={[]}
      />
    );
    expect(screen.getByTestId("analysis-loading")).toBeInTheDocument();
  });

  it("shows error state with retry button", () => {
    const onRefresh = vi.fn();
    render(
      <AiRecommendationsPanel
        {...defaultProps}
        status="error"
        error="Analysis failed"
        onRefresh={onRefresh}
      />
    );
    expect(screen.getByText("Analysis failed")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Retry"));
    expect(onRefresh).toHaveBeenCalled();
  });

  it("shows comprehensive message when no suggestions", () => {
    render(
      <AiRecommendationsPanel {...defaultProps} suggestions={[]} />
    );
    expect(
      screen.getByText(
        "No additional suggestions. Your outline looks comprehensive!"
      )
    ).toBeInTheDocument();
  });

  it("disables refresh button during loading", () => {
    render(
      <AiRecommendationsPanel {...defaultProps} status="loading" />
    );
    expect(screen.getByLabelText("Refresh analysis")).toBeDisabled();
  });

  it("applies high-priority styling for high priority suggestions", () => {
    render(<AiRecommendationsPanel {...defaultProps} />);
    const suggestionEl = screen
      .getByText("Error Handling")
      .closest("div[class*='p-2']");
    expect(suggestionEl?.className).toContain("bg-amber-50");
  });

  it("applies default styling for non-high priority suggestions", () => {
    const lowSuggestion = { ...mockSuggestion, id: "s2", priority: "low" as const };
    render(
      <AiRecommendationsPanel
        {...defaultProps}
        suggestions={[lowSuggestion]}
      />
    );
    const suggestionEl = screen
      .getByText("Error Handling")
      .closest("div[class*='p-2']");
    expect(suggestionEl?.className).toContain("bg-stone-50");
  });

  it("applies green color for high scores", () => {
    render(
      <AiRecommendationsPanel {...defaultProps} overallScore={85} />
    );
    const scoreEl = screen.getByText("85%");
    expect(scoreEl.className).toContain("text-emerald-600");
  });

  it("applies amber color for medium scores", () => {
    render(
      <AiRecommendationsPanel {...defaultProps} overallScore={65} />
    );
    const scoreEl = screen.getByText("65%");
    expect(scoreEl.className).toContain("text-amber-600");
  });

  it("applies red color for low scores", () => {
    render(
      <AiRecommendationsPanel {...defaultProps} overallScore={40} />
    );
    const scoreEl = screen.getByText("40%");
    expect(scoreEl.className).toContain("text-red-600");
  });
});
