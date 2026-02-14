import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { QAOverallScoreCard } from "../qa-overall-score-card";

describe("QAOverallScoreCard", () => {
  const defaultProps = {
    overallScore: 87,
    qualityLevel: "professional" as const,
    summary: "Analyzed 4 chapters with 10 suggestions.",
    readability: 92,
    consistency: 85,
    structure: 88,
    accuracy: 83,
  };

  it("renders overall score", () => {
    render(<QAOverallScoreCard {...defaultProps} />);
    expect(screen.getByText("87")).toBeInTheDocument();
  });

  it("renders quality level label", () => {
    render(<QAOverallScoreCard {...defaultProps} />);
    expect(screen.getByText("Professional Quality")).toBeInTheDocument();
  });

  it("renders summary text", () => {
    render(<QAOverallScoreCard {...defaultProps} />);
    expect(
      screen.getByText("Analyzed 4 chapters with 10 suggestions.")
    ).toBeInTheDocument();
  });

  it("renders all 4 dimension scores", () => {
    render(<QAOverallScoreCard {...defaultProps} />);
    expect(screen.getByText("92")).toBeInTheDocument(); // readability
    expect(screen.getByText("85")).toBeInTheDocument(); // consistency
    expect(screen.getByText("88")).toBeInTheDocument(); // structure
    expect(screen.getByText("83")).toBeInTheDocument(); // accuracy
  });

  it("renders dimension labels", () => {
    render(<QAOverallScoreCard {...defaultProps} />);
    expect(screen.getByText("Readability")).toBeInTheDocument();
    expect(screen.getByText("Consistency")).toBeInTheDocument();
    expect(screen.getByText("Structure")).toBeInTheDocument();
    expect(screen.getByText("Accuracy")).toBeInTheDocument();
  });

  it("renders exceptional quality level", () => {
    render(
      <QAOverallScoreCard
        {...defaultProps}
        overallScore={95}
        qualityLevel="exceptional"
      />
    );
    expect(screen.getByText("Exceptional Quality")).toBeInTheDocument();
  });

  it("renders needs-improvement quality level", () => {
    render(
      <QAOverallScoreCard
        {...defaultProps}
        overallScore={65}
        qualityLevel="needs-improvement"
      />
    );
    expect(screen.getByText("Needs Improvement")).toBeInTheDocument();
  });
});
