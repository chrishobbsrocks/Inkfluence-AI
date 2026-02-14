import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { EditableChapterItem } from "../editable-chapter-item";
import type { EditorSection } from "@/hooks/use-outline-editor";

// Mock dnd-kit
vi.mock("@dnd-kit/sortable", () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
}));

vi.mock("@dnd-kit/utilities", () => ({
  CSS: {
    Transform: {
      toString: () => null,
    },
  },
}));

const mockSection: EditorSection = {
  id: "section-1",
  chapterTitle: "Introduction",
  keyPoints: ["Setting the stage", "Key concepts"],
  orderIndex: 0,
  aiSuggested: false,
};

describe("EditableChapterItem", () => {
  it("renders chapter number and title", () => {
    const dispatch = vi.fn();
    render(
      <EditableChapterItem
        section={mockSection}
        chapterNumber={1}
        dispatch={dispatch}
      />
    );
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("Introduction")).toBeInTheDocument();
  });

  it("renders key points as sub-sections", () => {
    const dispatch = vi.fn();
    render(
      <EditableChapterItem
        section={mockSection}
        chapterNumber={1}
        dispatch={dispatch}
      />
    );
    expect(screen.getByText("Setting the stage")).toBeInTheDocument();
    expect(screen.getByText("Key concepts")).toBeInTheDocument();
  });

  it("shows AI suggested badge for AI-suggested chapters", () => {
    const dispatch = vi.fn();
    const aiSection = { ...mockSection, aiSuggested: true };
    render(
      <EditableChapterItem
        section={aiSection}
        chapterNumber={2}
        dispatch={dispatch}
      />
    );
    expect(screen.getByText("AI suggested")).toBeInTheDocument();
  });

  it("shows word count estimate", () => {
    const dispatch = vi.fn();
    render(
      <EditableChapterItem
        section={mockSection}
        chapterNumber={1}
        dispatch={dispatch}
      />
    );
    // 2 key points * 800 = 1600
    expect(screen.getByText("~1600 words")).toBeInTheDocument();
  });

  it("enters edit mode on title click", async () => {
    const user = userEvent.setup();
    const dispatch = vi.fn();
    render(
      <EditableChapterItem
        section={mockSection}
        chapterNumber={1}
        dispatch={dispatch}
      />
    );

    await user.click(screen.getByText("Introduction"));

    const input = screen.getByDisplayValue("Introduction");
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe("INPUT");
  });

  it("saves title on blur", async () => {
    const user = userEvent.setup();
    const dispatch = vi.fn();
    render(
      <EditableChapterItem
        section={mockSection}
        chapterNumber={1}
        dispatch={dispatch}
      />
    );

    await user.click(screen.getByText("Introduction"));
    const input = screen.getByDisplayValue("Introduction");
    await user.clear(input);
    await user.type(input, "New Title");
    await user.tab(); // triggers blur

    expect(dispatch).toHaveBeenCalledWith({
      type: "UPDATE_TITLE",
      sectionId: "section-1",
      title: "New Title",
    });
  });

  it("saves title on Enter", async () => {
    const user = userEvent.setup();
    const dispatch = vi.fn();
    render(
      <EditableChapterItem
        section={mockSection}
        chapterNumber={1}
        dispatch={dispatch}
      />
    );

    await user.click(screen.getByText("Introduction"));
    const input = screen.getByDisplayValue("Introduction");
    await user.clear(input);
    await user.type(input, "Updated{Enter}");

    expect(dispatch).toHaveBeenCalledWith({
      type: "UPDATE_TITLE",
      sectionId: "section-1",
      title: "Updated",
    });
  });

  it("reverts title on Escape", async () => {
    const user = userEvent.setup();
    const dispatch = vi.fn();
    render(
      <EditableChapterItem
        section={mockSection}
        chapterNumber={1}
        dispatch={dispatch}
      />
    );

    await user.click(screen.getByText("Introduction"));
    const input = screen.getByDisplayValue("Introduction");
    await user.clear(input);
    await user.type(input, "Discarded");
    await user.keyboard("{Escape}");

    // Should NOT dispatch UPDATE_TITLE
    expect(dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: "UPDATE_TITLE" })
    );
    // Should show original title
    expect(screen.getByText("Introduction")).toBeInTheDocument();
  });

  it("renders add sub-section button", () => {
    const dispatch = vi.fn();
    render(
      <EditableChapterItem
        section={mockSection}
        chapterNumber={1}
        dispatch={dispatch}
      />
    );
    expect(screen.getByText("Add sub-section")).toBeInTheDocument();
  });

  it("dispatches ADD_SUB_SECTION on add sub-section click", async () => {
    const user = userEvent.setup();
    const dispatch = vi.fn();
    render(
      <EditableChapterItem
        section={mockSection}
        chapterNumber={1}
        dispatch={dispatch}
      />
    );

    await user.click(screen.getByText("Add sub-section"));
    expect(dispatch).toHaveBeenCalledWith({
      type: "ADD_SUB_SECTION",
      sectionId: "section-1",
    });
  });

  it("shows drag handle", () => {
    const dispatch = vi.fn();
    render(
      <EditableChapterItem
        section={mockSection}
        chapterNumber={1}
        dispatch={dispatch}
      />
    );
    expect(screen.getByLabelText("Drag to reorder")).toBeInTheDocument();
  });
});
