import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { AiWritingPanel } from "../ai-writing-panel";
import type { AiWritingPanelProps } from "../ai-writing-panel";

function renderPanel(overrides: Partial<AiWritingPanelProps> = {}) {
  const defaultProps: AiWritingPanelProps = {
    tone: "professional",
    expertise: "intermediate",
    onToneChange: vi.fn(),
    onExpertiseChange: vi.fn(),
    wordCount: 0,
    targetWordCount: 3000,
    progressPercent: 0,
    sections: [],
    isGenerating: false,
    onGenerate: vi.fn(),
    ...overrides,
  };
  return { ...render(<AiWritingPanel {...defaultProps} />), props: defaultProps };
}

describe("AiWritingPanel", () => {
  it("renders AI Writing Assistant title", () => {
    renderPanel();
    expect(screen.getByText("AI Writing Assistant")).toBeInTheDocument();
  });

  it("renders all tone buttons", () => {
    renderPanel();
    expect(screen.getByText("Professional")).toBeInTheDocument();
    expect(screen.getByText("Conversational")).toBeInTheDocument();
    expect(screen.getByText("Academic")).toBeInTheDocument();
  });

  it("renders all expertise buttons", () => {
    renderPanel();
    expect(screen.getByText("Beginner")).toBeInTheDocument();
    expect(screen.getByText("Intermediate")).toBeInTheDocument();
    expect(screen.getByText("Expert")).toBeInTheDocument();
  });

  it("calls onToneChange when tone button clicked", async () => {
    const user = userEvent.setup();
    const onToneChange = vi.fn();
    renderPanel({ onToneChange });

    await user.click(screen.getByText("Academic"));
    expect(onToneChange).toHaveBeenCalledWith("academic");
  });

  it("calls onExpertiseChange when expertise button clicked", async () => {
    const user = userEvent.setup();
    const onExpertiseChange = vi.fn();
    renderPanel({ onExpertiseChange });

    await user.click(screen.getByText("Expert"));
    expect(onExpertiseChange).toHaveBeenCalledWith("expert");
  });

  it("renders word count display", () => {
    renderPanel({ wordCount: 1500, targetWordCount: 3000, progressPercent: 50 });
    expect(screen.getByText(/1,500/)).toBeInTheDocument();
    expect(screen.getByText(/3,000/)).toBeInTheDocument();
  });

  it("renders chapter progress heading", () => {
    renderPanel();
    expect(screen.getByText("Chapter progress")).toBeInTheDocument();
  });

  it("renders section checklist items", () => {
    renderPanel({
      sections: [
        { text: "Introduction", status: "done" },
        { text: "Key metrics", status: "active" },
        { text: "Framework", status: "pending" },
      ],
    });
    expect(screen.getByText("Introduction")).toBeInTheDocument();
    expect(screen.getByText("Key metrics")).toBeInTheDocument();
    expect(screen.getByText("Framework")).toBeInTheDocument();
  });

  it("renders sections heading when sections exist", () => {
    renderPanel({
      sections: [{ text: "Intro", status: "active" }],
    });
    expect(screen.getByText("Sections")).toBeInTheDocument();
  });

  it("renders Generate Chapter button", () => {
    renderPanel();
    expect(
      screen.getByRole("button", { name: /Generate Chapter/ })
    ).toBeInTheDocument();
  });

  it("calls onGenerate when generate button clicked", async () => {
    const user = userEvent.setup();
    const onGenerate = vi.fn();
    renderPanel({ onGenerate });

    await user.click(screen.getByRole("button", { name: /Generate Chapter/ }));
    expect(onGenerate).toHaveBeenCalled();
  });

  it("shows loading state when generating", () => {
    renderPanel({ isGenerating: true });
    expect(screen.getByText("Generating...")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Generating/ })
    ).toBeDisabled();
  });

  it("disables tone buttons when generating", () => {
    renderPanel({ isGenerating: true });
    const academicBtn = screen.getByText("Academic");
    expect(academicBtn.closest("button")).toBeDisabled();
  });

  it("disables expertise buttons when generating", () => {
    renderPanel({ isGenerating: true });
    const expertBtn = screen.getByText("Expert");
    expect(expertBtn.closest("button")).toBeDisabled();
  });
});
