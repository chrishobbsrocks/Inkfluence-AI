import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { OutlineEditor } from "../outline-editor";
import type { EditorSection, OutlineEditorAction } from "@/hooks/use-outline-editor";

// Mock dnd-kit
vi.mock("@dnd-kit/core", () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  closestCenter: vi.fn(),
  KeyboardSensor: vi.fn(),
  PointerSensor: vi.fn(),
  useSensor: vi.fn(),
  useSensors: () => [],
}));

vi.mock("@dnd-kit/sortable", () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  sortableKeyboardCoordinates: vi.fn(),
  verticalListSortingStrategy: vi.fn(),
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

vi.mock("@dnd-kit/modifiers", () => ({
  restrictToVerticalAxis: vi.fn(),
}));

const mockSections: EditorSection[] = [
  {
    id: "s1",
    chapterTitle: "Introduction",
    keyPoints: ["Opening remarks"],
    orderIndex: 0,
    aiSuggested: false,
  },
  {
    id: "s2",
    chapterTitle: "Getting Started",
    keyPoints: [],
    orderIndex: 1,
    aiSuggested: true,
  },
];

describe("OutlineEditor", () => {
  it("renders all chapters", () => {
    const dispatch = vi.fn();
    render(
      <OutlineEditor
        sections={mockSections}
        dispatch={dispatch}
        saveStatus="idle"
      />
    );
    expect(screen.getByText("Introduction")).toBeInTheDocument();
    expect(screen.getByText("Getting Started")).toBeInTheDocument();
  });

  it("shows chapter count", () => {
    const dispatch = vi.fn();
    render(
      <OutlineEditor
        sections={mockSections}
        dispatch={dispatch}
        saveStatus="idle"
      />
    );
    expect(screen.getByText("Chapters (2)")).toBeInTheDocument();
  });

  it("renders add chapter button at the bottom", () => {
    const dispatch = vi.fn();
    render(
      <OutlineEditor
        sections={mockSections}
        dispatch={dispatch}
        saveStatus="idle"
      />
    );
    expect(screen.getByText("Add new chapter...")).toBeInTheDocument();
  });

  it("dispatches ADD_CHAPTER when add button is clicked", async () => {
    const user = userEvent.setup();
    const dispatch = vi.fn();
    render(
      <OutlineEditor
        sections={mockSections}
        dispatch={dispatch}
        saveStatus="idle"
      />
    );

    await user.click(screen.getByText("Add new chapter..."));
    expect(dispatch).toHaveBeenCalledWith({ type: "ADD_CHAPTER" });
  });

  it("shows saving status", () => {
    const dispatch = vi.fn();
    render(
      <OutlineEditor
        sections={mockSections}
        dispatch={dispatch}
        saveStatus="saving"
      />
    );
    expect(screen.getByText("Saving...")).toBeInTheDocument();
  });

  it("shows saved status", () => {
    const dispatch = vi.fn();
    render(
      <OutlineEditor
        sections={mockSections}
        dispatch={dispatch}
        saveStatus="saved"
      />
    );
    expect(screen.getByText("Saved")).toBeInTheDocument();
  });

  it("shows error status", () => {
    const dispatch = vi.fn();
    render(
      <OutlineEditor
        sections={mockSections}
        dispatch={dispatch}
        saveStatus="error"
      />
    );
    expect(screen.getByText("Error saving")).toBeInTheDocument();
  });

  it("shows nothing for idle status", () => {
    const dispatch = vi.fn();
    render(
      <OutlineEditor
        sections={mockSections}
        dispatch={dispatch}
        saveStatus="idle"
      />
    );
    expect(screen.queryByText("Saving...")).not.toBeInTheDocument();
    expect(screen.queryByText("Saved")).not.toBeInTheDocument();
    expect(screen.queryByText("Error saving")).not.toBeInTheDocument();
  });
});
