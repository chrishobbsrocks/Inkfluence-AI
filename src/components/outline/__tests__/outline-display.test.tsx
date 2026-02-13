import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { OutlineDisplay } from "../outline-display";

const mockSections = [
  {
    id: "s1",
    chapterTitle: "Introduction",
    keyPoints: ["Overview", "Goals"],
    orderIndex: 0,
    aiSuggested: false,
  },
  {
    id: "s2",
    chapterTitle: "Core Concepts",
    keyPoints: ["Fundamentals"],
    orderIndex: 1,
    aiSuggested: false,
  },
  {
    id: "s3",
    chapterTitle: "Advanced Topics",
    keyPoints: [],
    orderIndex: 2,
    aiSuggested: true,
  },
];

describe("OutlineDisplay", () => {
  it("renders chapter count", () => {
    render(<OutlineDisplay sections={mockSections} gaps={[]} />);
    expect(screen.getByText("Chapters (3)")).toBeInTheDocument();
  });

  it("renders all chapter titles", () => {
    render(<OutlineDisplay sections={mockSections} gaps={[]} />);
    expect(screen.getByText("Introduction")).toBeInTheDocument();
    expect(screen.getByText("Core Concepts")).toBeInTheDocument();
    expect(screen.getByText("Advanced Topics")).toBeInTheDocument();
  });

  it("renders AI recommendations panel", () => {
    render(<OutlineDisplay sections={mockSections} gaps={[]} />);
    expect(screen.getByText("AI Recommendations")).toBeInTheDocument();
  });

  it("shows gap suggestions in recommendations panel", () => {
    const gaps = [
      { area: "Marketing", description: "Missing marketing section", importance: "high" as const },
    ];
    render(<OutlineDisplay sections={mockSections} gaps={gaps} />);
    expect(screen.getByText("Marketing")).toBeInTheDocument();
    expect(screen.getByText("Missing marketing section")).toBeInTheDocument();
  });
});
