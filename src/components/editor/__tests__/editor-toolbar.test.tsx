import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { EditorToolbar } from "../editor-toolbar";
import { TooltipProvider } from "@/components/ui/tooltip";

function createMockEditor() {
  const run = vi.fn();
  const chain = {
    focus: vi.fn().mockReturnThis(),
    toggleBold: vi.fn().mockReturnValue({ run }),
    toggleItalic: vi.fn().mockReturnValue({ run }),
    toggleUnderline: vi.fn().mockReturnValue({ run }),
    toggleHeading: vi.fn().mockReturnValue({ run }),
    toggleBlockquote: vi.fn().mockReturnValue({ run }),
    toggleBulletList: vi.fn().mockReturnValue({ run }),
    toggleOrderedList: vi.fn().mockReturnValue({ run }),
  };

  return {
    chain: vi.fn(() => chain),
    isActive: vi.fn(() => false),
    _chain: chain,
    _run: run,
  };
}

function renderToolbar(editor: ReturnType<typeof createMockEditor>) {
  return render(
    <TooltipProvider>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <EditorToolbar editor={editor as any} />
    </TooltipProvider>
  );
}

describe("EditorToolbar", () => {
  it("renders nothing when editor is null", () => {
    const { container } = render(
      <TooltipProvider>
        <EditorToolbar editor={null} />
      </TooltipProvider>
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders all formatting buttons", () => {
    const editor = createMockEditor();
    renderToolbar(editor);

    expect(screen.getByLabelText(/Bold/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Italic/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Underline/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Heading 1/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Heading 2/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Quote/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Bullet List/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ordered List/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Image/)).toBeInTheDocument();
  });

  it("calls toggleBold when bold button clicked", async () => {
    const user = userEvent.setup();
    const editor = createMockEditor();
    renderToolbar(editor);

    await user.click(screen.getByLabelText(/Bold/));
    expect(editor._chain.toggleBold).toHaveBeenCalled();
    expect(editor._run).toHaveBeenCalled();
  });

  it("calls toggleItalic when italic button clicked", async () => {
    const user = userEvent.setup();
    const editor = createMockEditor();
    renderToolbar(editor);

    await user.click(screen.getByLabelText(/Italic/));
    expect(editor._chain.toggleItalic).toHaveBeenCalled();
  });

  it("calls toggleUnderline when underline button clicked", async () => {
    const user = userEvent.setup();
    const editor = createMockEditor();
    renderToolbar(editor);

    await user.click(screen.getByLabelText(/Underline/));
    expect(editor._chain.toggleUnderline).toHaveBeenCalled();
  });

  it("image button is disabled", () => {
    const editor = createMockEditor();
    renderToolbar(editor);

    const imageBtn = screen.getByLabelText(/Image/);
    expect(imageBtn).toBeDisabled();
  });

  it("shows active state for bold when isActive returns true", () => {
    const editor = createMockEditor();
    editor.isActive.mockImplementation(
      (format: string) => format === "bold"
    );
    renderToolbar(editor);

    const boldBtn = screen.getByLabelText(/Bold/);
    expect(boldBtn.className).toContain("bg-stone-200");
  });
});
