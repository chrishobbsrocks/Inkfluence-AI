import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PrePublishChecklist } from "../pre-publish-checklist";
import type { PrePublishChecklistItem } from "@/types/book-metadata";

const mockItems: PrePublishChecklistItem[] = [
  {
    id: "chapters-complete",
    label: "All chapters complete",
    description: "8/8 chapters written and reviewed",
    completed: true,
    actionPath: "/books/{bookId}/editor",
  },
  {
    id: "quality-check",
    label: "Quality check passed",
    description: "Score: 87/100 — Professional quality",
    completed: true,
    actionPath: "/books/{bookId}/qa",
  },
  {
    id: "cover-finalized",
    label: "Cover design finalized",
    description: "No cover uploaded yet",
    completed: false,
    actionPath: "/books/{bookId}/preview",
  },
  {
    id: "metadata-complete",
    label: "Metadata completed",
    description: "Review auto-generated keywords and description",
    completed: false,
  },
];

const bookId = "550e8400-e29b-41d4-a716-446655440000";

describe("PrePublishChecklist", () => {
  it("renders the checklist title", () => {
    render(<PrePublishChecklist bookId={bookId} items={mockItems} />);
    expect(screen.getByText("Pre-publish checklist")).toBeInTheDocument();
  });

  it("renders all checklist items", () => {
    render(<PrePublishChecklist bookId={bookId} items={mockItems} />);
    expect(screen.getByText("All chapters complete")).toBeInTheDocument();
    expect(screen.getByText("Quality check passed")).toBeInTheDocument();
    expect(screen.getByText("Cover design finalized")).toBeInTheDocument();
    expect(screen.getByText("Metadata completed")).toBeInTheDocument();
  });

  it("renders descriptions for all items", () => {
    render(<PrePublishChecklist bookId={bookId} items={mockItems} />);
    expect(
      screen.getByText("8/8 chapters written and reviewed")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Score: 87/100 — Professional quality")
    ).toBeInTheDocument();
  });

  it("shows Complete button for incomplete items with actionPath", () => {
    render(<PrePublishChecklist bookId={bookId} items={mockItems} />);
    const completeLinks = screen.getAllByRole("link");
    // Only "Cover design finalized" has both incomplete + actionPath
    expect(completeLinks).toHaveLength(1);
  });

  it("does not show Complete button for incomplete items without actionPath", () => {
    render(<PrePublishChecklist bookId={bookId} items={mockItems} />);
    // Metadata is incomplete but has no actionPath — should not render a link
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1); // Only cover
  });

  it("does not show Complete button for completed items", () => {
    const allComplete = mockItems.map((item) => ({
      ...item,
      completed: true,
    }));
    render(<PrePublishChecklist bookId={bookId} items={allComplete} />);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });

  it("replaces {bookId} in actionPath with actual bookId", () => {
    render(<PrePublishChecklist bookId={bookId} items={mockItems} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/books/${bookId}/preview`);
  });
});
