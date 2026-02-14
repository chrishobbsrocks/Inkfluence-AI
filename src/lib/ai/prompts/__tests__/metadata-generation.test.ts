import { describe, it, expect } from "vitest";
import {
  buildMetadataGenerationPrompt,
  metadataGenerationTool,
} from "../metadata-generation";

describe("buildMetadataGenerationPrompt", () => {
  it("includes the book title", () => {
    const result = buildMetadataGenerationPrompt(
      "The Growth Playbook",
      "SaaS growth strategies",
      null,
      [],
      10000
    );
    expect(result).toContain("The Growth Playbook");
  });

  it("includes the book topic", () => {
    const result = buildMetadataGenerationPrompt(
      "Test Book",
      "SaaS growth strategies",
      null,
      [],
      5000
    );
    expect(result).toContain("SaaS growth strategies");
  });

  it("includes audience when provided", () => {
    const result = buildMetadataGenerationPrompt(
      "Test Book",
      "TypeScript",
      "Senior developers",
      [],
      5000
    );
    expect(result).toContain("Senior developers");
  });

  it("uses default audience when null", () => {
    const result = buildMetadataGenerationPrompt(
      "Test Book",
      "TypeScript",
      null,
      [],
      5000
    );
    expect(result).toContain("General readers interested in the topic");
  });

  it("includes chapter titles as numbered list", () => {
    const result = buildMetadataGenerationPrompt(
      "Test Book",
      "TypeScript",
      null,
      ["Introduction", "Getting Started", "Advanced Topics"],
      10000
    );
    expect(result).toContain("1. Introduction");
    expect(result).toContain("2. Getting Started");
    expect(result).toContain("3. Advanced Topics");
  });

  it("handles empty chapter titles", () => {
    const result = buildMetadataGenerationPrompt(
      "Test Book",
      "TypeScript",
      null,
      [],
      0
    );
    expect(result).toContain("No chapters available");
  });

  it("includes total word count", () => {
    const result = buildMetadataGenerationPrompt(
      "Test Book",
      "TypeScript",
      null,
      [],
      15000
    );
    expect(result).toContain("15000");
  });

  it("mentions 150 words for description", () => {
    const result = buildMetadataGenerationPrompt(
      "Test Book",
      "TypeScript",
      null,
      [],
      5000
    );
    expect(result).toContain("150 words");
  });

  it("mentions up to 7 keywords", () => {
    const result = buildMetadataGenerationPrompt(
      "Test Book",
      "TypeScript",
      null,
      [],
      5000
    );
    expect(result).toContain("7");
  });

  it("includes category list", () => {
    const result = buildMetadataGenerationPrompt(
      "Test Book",
      "TypeScript",
      null,
      [],
      5000
    );
    expect(result).toContain("Business & Money");
    expect(result).toContain("Self-Help");
    expect(result).toContain("Technology");
  });
});

describe("metadataGenerationTool", () => {
  it("has correct tool name", () => {
    expect(metadataGenerationTool.name).toBe("generate_book_metadata");
  });

  it("requires description", () => {
    expect(metadataGenerationTool.input_schema.required).toContain(
      "description"
    );
  });

  it("requires keywords", () => {
    expect(metadataGenerationTool.input_schema.required).toContain("keywords");
  });

  it("requires category", () => {
    expect(metadataGenerationTool.input_schema.required).toContain("category");
  });

  it("defines keywords as array type", () => {
    expect(
      metadataGenerationTool.input_schema.properties.keywords.type
    ).toBe("array");
  });
});
