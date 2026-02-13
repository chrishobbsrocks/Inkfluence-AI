import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { WizardStepper } from "../wizard-stepper";

describe("WizardStepper", () => {
  it("renders all 5 step labels", () => {
    render(<WizardStepper currentPhase="topic_exploration" />);
    expect(screen.getByText("Topic")).toBeInTheDocument();
    expect(screen.getByText("Audience")).toBeInTheDocument();
    expect(screen.getByText("Expertise")).toBeInTheDocument();
    expect(screen.getByText("Outline")).toBeInTheDocument();
    expect(screen.getByText("Review")).toBeInTheDocument();
  });

  it("marks first step as active for topic_exploration", () => {
    render(<WizardStepper currentPhase="topic_exploration" />);
    const topicLabel = screen.getByText("Topic");
    expect(topicLabel).toHaveClass("font-semibold", "text-stone-900");
  });

  it("marks third step as active for expertise_extraction", () => {
    render(<WizardStepper currentPhase="expertise_extraction" />);
    const expertiseLabel = screen.getByText("Expertise");
    expect(expertiseLabel).toHaveClass("font-semibold", "text-stone-900");
    // Topic and Audience should be completed (lighter text)
    const topicLabel = screen.getByText("Topic");
    expect(topicLabel).toHaveClass("text-stone-400");
  });

  it("marks last step as active for outline_generation", () => {
    render(<WizardStepper currentPhase="outline_generation" />);
    const reviewLabel = screen.getByText("Review");
    expect(reviewLabel).toHaveClass("font-semibold", "text-stone-900");
  });
});
