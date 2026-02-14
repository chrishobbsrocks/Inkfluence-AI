import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QAWrapper } from "../qa-wrapper";
import type { QAAnalysisResult } from "@/types/qa-analysis";

const mockAnalysis: QAAnalysisResult = {
  overallScore: 85,
  qualityLevel: "professional",
  readability: 88,
  consistency: 82,
  structure: 86,
  accuracy: 84,
  summary: "Book scored 85/100 (professional). Analyzed 2 chapters.",
  chapterScores: [
    {
      chapterId: "ch-1",
      chapterTitle: "Introduction",
      orderIndex: 0,
      overallScore: 90,
      readability: 92,
      consistency: 88,
      structure: 90,
      accuracy: 90,
      suggestionCount: 2,
      wordCount: 500,
    },
    {
      chapterId: "ch-2",
      chapterTitle: "Deep Dive",
      orderIndex: 1,
      overallScore: 78,
      readability: 80,
      consistency: 75,
      structure: 80,
      accuracy: 77,
      suggestionCount: 4,
      wordCount: 800,
    },
  ],
  suggestions: [
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
  ],
  analyzedAt: "2026-02-13T12:00:00Z",
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("QAWrapper", () => {
  it("renders header with Quality Review title", () => {
    render(
      <QAWrapper bookId="book-1" initialAnalysis={mockAnalysis} />
    );
    expect(screen.getByText("Quality Review")).toBeInTheDocument();
  });

  it("shows empty state when no analysis", () => {
    render(<QAWrapper bookId="book-1" initialAnalysis={null} />);
    expect(screen.getByText("No Quality Analysis Yet")).toBeInTheDocument();
    // Both header and empty state show "Run Analysis"
    const buttons = screen.getAllByRole("button", { name: /Run Analysis/i });
    expect(buttons.length).toBe(2);
  });

  it("shows Run Analysis button in header when no analysis", () => {
    render(<QAWrapper bookId="book-1" initialAnalysis={null} />);
    // Header should show "Run Analysis" instead of "Re-run"
    const buttons = screen.getAllByRole("button", { name: /Run Analysis/i });
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });

  it("shows overall score card when analysis exists", () => {
    render(
      <QAWrapper bookId="book-1" initialAnalysis={mockAnalysis} />
    );
    expect(screen.getByText("85")).toBeInTheDocument();
    expect(screen.getByText("Professional Quality")).toBeInTheDocument();
  });

  it("renders 4 dimension scores", () => {
    render(
      <QAWrapper bookId="book-1" initialAnalysis={mockAnalysis} />
    );
    expect(screen.getByText("Readability")).toBeInTheDocument();
    expect(screen.getByText("Consistency")).toBeInTheDocument();
    expect(screen.getByText("Structure")).toBeInTheDocument();
    expect(screen.getByText("Accuracy")).toBeInTheDocument();
  });

  it("renders chapter scores list", () => {
    render(
      <QAWrapper bookId="book-1" initialAnalysis={mockAnalysis} />
    );
    expect(screen.getByText("Chapter Scores")).toBeInTheDocument();
    expect(screen.getByText("Introduction")).toBeInTheDocument();
    expect(screen.getByText("Deep Dive")).toBeInTheDocument();
  });

  it("renders suggestions list", () => {
    render(
      <QAWrapper bookId="book-1" initialAnalysis={mockAnalysis} />
    );
    expect(screen.getByText("Inconsistent terminology")).toBeInTheDocument();
    expect(screen.getByText("Passive voice detected")).toBeInTheDocument();
    expect(screen.getByText("Missing conclusion")).toBeInTheDocument();
  });

  it("shows Re-run button when analysis exists", () => {
    render(
      <QAWrapper bookId="book-1" initialAnalysis={mockAnalysis} />
    );
    expect(screen.getByRole("button", { name: /Re-run/i })).toBeInTheDocument();
  });

  it("shows Fix All Issues button when analysis exists", () => {
    render(
      <QAWrapper bookId="book-1" initialAnalysis={mockAnalysis} />
    );
    expect(
      screen.getByRole("button", { name: /Fix All Issues/i })
    ).toBeInTheDocument();
  });

  it("filters suggestions when View is clicked on a chapter", async () => {
    const user = userEvent.setup();
    render(
      <QAWrapper bookId="book-1" initialAnalysis={mockAnalysis} />
    );

    // Click "View" on ch-2 (Deep Dive)
    const viewButtons = screen.getAllByRole("button", { name: "View" });
    await user.click(viewButtons[1]!); // second chapter

    // Should show ch-2 suggestions only
    expect(screen.getByText("Passive voice detected")).toBeInTheDocument();
    expect(screen.getByText("Missing conclusion")).toBeInTheDocument();
    // ch-1 suggestion should be hidden
    expect(screen.queryByText("Inconsistent terminology")).not.toBeInTheDocument();
  });

  it("shows Auto-fix buttons for fixable suggestions", () => {
    render(
      <QAWrapper bookId="book-1" initialAnalysis={mockAnalysis} />
    );
    const autoFixButtons = screen.getAllByRole("button", { name: /Auto-fix/i });
    expect(autoFixButtons).toHaveLength(2); // s-1 and s-2 are auto-fixable
  });

  it("does not show Auto-fix button for non-fixable suggestions", () => {
    render(
      <QAWrapper bookId="book-1" initialAnalysis={mockAnalysis} />
    );
    // "Missing conclusion" (s-3) is not auto-fixable
    expect(screen.getByText("Missing conclusion")).toBeInTheDocument();
    // Only 2 auto-fix buttons, not 3
    const autoFixButtons = screen.getAllByRole("button", { name: /Auto-fix/i });
    expect(autoFixButtons).toHaveLength(2);
  });

  it("calls fetch when Run Analysis is clicked", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(mockAnalysis), { status: 200 })
    );

    render(<QAWrapper bookId="book-1" initialAnalysis={null} />);
    const buttons = screen.getAllByRole("button", { name: /Run Analysis/i });
    await user.click(buttons[0]!);

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/qa/analyze",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ bookId: "book-1" }),
      })
    );
  });
});
