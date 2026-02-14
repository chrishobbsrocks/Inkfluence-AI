import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FormatOptionsPanel } from "../format-options-panel";
import { BOOK_TEMPLATES } from "@/lib/templates";

const modernTemplate = BOOK_TEMPLATES[0]!;

describe("FormatOptionsPanel", () => {
  it("renders Formatting Options header", () => {
    render(
      <FormatOptionsPanel
        templates={BOOK_TEMPLATES}
        selectedTemplateId="modern"
        selectedTemplate={modernTemplate}
        onTemplateSelect={() => {}}
      />
    );
    expect(screen.getByText("Formatting Options")).toBeInTheDocument();
  });

  it("renders template section", () => {
    render(
      <FormatOptionsPanel
        templates={BOOK_TEMPLATES}
        selectedTemplateId="modern"
        selectedTemplate={modernTemplate}
        onTemplateSelect={() => {}}
      />
    );
    expect(screen.getByText("Template")).toBeInTheDocument();
  });

  it("renders font/size/margins for modern template", () => {
    render(
      <FormatOptionsPanel
        templates={BOOK_TEMPLATES}
        selectedTemplateId="modern"
        selectedTemplate={modernTemplate}
        onTemplateSelect={() => {}}
      />
    );
    expect(screen.getByText("DM Sans")).toBeInTheDocument();
    expect(screen.getByText("11pt")).toBeInTheDocument();
    expect(screen.getByText("Standard")).toBeInTheDocument();
  });

  it("renders export buttons", () => {
    render(
      <FormatOptionsPanel
        templates={BOOK_TEMPLATES}
        selectedTemplateId="modern"
        selectedTemplate={modernTemplate}
        onTemplateSelect={() => {}}
      />
    );
    expect(screen.getByText("PDF")).toBeInTheDocument();
    expect(screen.getByText("EPUB")).toBeInTheDocument();
    expect(screen.getByText("MOBI")).toBeInTheDocument();
  });

  it("renders Generate AI Cover button", () => {
    render(
      <FormatOptionsPanel
        templates={BOOK_TEMPLATES}
        selectedTemplateId="modern"
        selectedTemplate={modernTemplate}
        onTemplateSelect={() => {}}
      />
    );
    expect(screen.getByText("Generate AI Cover")).toBeInTheDocument();
  });

  it("shows different values for classic template", () => {
    const classicTemplate = BOOK_TEMPLATES[1]!;
    render(
      <FormatOptionsPanel
        templates={BOOK_TEMPLATES}
        selectedTemplateId="classic"
        selectedTemplate={classicTemplate}
        onTemplateSelect={() => {}}
      />
    );
    expect(screen.getByText("Georgia")).toBeInTheDocument();
    expect(screen.getByText("12pt")).toBeInTheDocument();
  });
});
