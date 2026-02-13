import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { OutlineChapterItem } from "../outline-chapter-item";

describe("OutlineChapterItem", () => {
  it("renders chapter number and title", () => {
    render(
      <OutlineChapterItem
        chapterNumber={1}
        chapterTitle="Introduction"
        keyPoints={[]}
      />
    );
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("Introduction")).toBeInTheDocument();
  });

  it("renders key points", () => {
    render(
      <OutlineChapterItem
        chapterNumber={2}
        chapterTitle="Chapter Two"
        keyPoints={["Point A", "Point B"]}
      />
    );
    expect(screen.getByText("Point A")).toBeInTheDocument();
    expect(screen.getByText("Point B")).toBeInTheDocument();
  });

  it("shows AI suggested badge when aiSuggested is true", () => {
    render(
      <OutlineChapterItem
        chapterNumber={3}
        chapterTitle="Bonus Chapter"
        keyPoints={[]}
        aiSuggested
      />
    );
    expect(screen.getByText("AI suggested")).toBeInTheDocument();
  });

  it("does not show AI badge by default", () => {
    render(
      <OutlineChapterItem
        chapterNumber={1}
        chapterTitle="Regular Chapter"
        keyPoints={[]}
      />
    );
    expect(screen.queryByText("AI suggested")).not.toBeInTheDocument();
  });
});
