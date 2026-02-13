import { describe, it, expect } from "vitest";
import {
  parseGapSuggestions,
  parsePhaseSignal,
  stripStructuredTags,
} from "@/lib/ai/response-parser";

describe("parseGapSuggestions", () => {
  it("extracts a single gap suggestion", () => {
    const text = `Great insight!
<gap_suggestion>
<area>Pricing Strategy</area>
<description>You haven't covered pricing models yet</description>
<importance>high</importance>
</gap_suggestion>
What about pricing?`;

    const gaps = parseGapSuggestions(text);
    expect(gaps).toHaveLength(1);
    expect(gaps[0]).toEqual({
      area: "Pricing Strategy",
      description: "You haven't covered pricing models yet",
      importance: "high",
    });
  });

  it("extracts multiple gap suggestions", () => {
    const text = `
<gap_suggestion>
<area>Marketing</area>
<description>No marketing coverage</description>
<importance>high</importance>
</gap_suggestion>
<gap_suggestion>
<area>Analytics</area>
<description>Data analysis missing</description>
<importance>medium</importance>
</gap_suggestion>`;

    const gaps = parseGapSuggestions(text);
    expect(gaps).toHaveLength(2);
    expect(gaps[0]!.area).toBe("Marketing");
    expect(gaps[1]!.area).toBe("Analytics");
    expect(gaps[1]!.importance).toBe("medium");
  });

  it("returns empty array when no tags present", () => {
    const text = "Just a normal response with no structured data.";
    const gaps = parseGapSuggestions(text);
    expect(gaps).toEqual([]);
  });

  it("handles importance values correctly", () => {
    const text = `
<gap_suggestion>
<area>Test</area>
<description>Desc</description>
<importance>low</importance>
</gap_suggestion>`;

    const gaps = parseGapSuggestions(text);
    expect(gaps[0]!.importance).toBe("low");
  });
});

describe("parsePhaseSignal", () => {
  it("extracts the phase signal text", () => {
    const text = "We have enough info. <phase_signal>ready_for_outline</phase_signal> Shall we proceed?";
    const signal = parsePhaseSignal(text);
    expect(signal).toBe("ready_for_outline");
  });

  it("returns null when no signal present", () => {
    const text = "Just a normal response.";
    const signal = parsePhaseSignal(text);
    expect(signal).toBeNull();
  });

  it("trims whitespace from signal", () => {
    const text = "<phase_signal>  ready_for_outline  </phase_signal>";
    const signal = parsePhaseSignal(text);
    expect(signal).toBe("ready_for_outline");
  });
});

describe("stripStructuredTags", () => {
  it("removes gap suggestion tags", () => {
    const text = `Hello!
<gap_suggestion>
<area>Test</area>
<description>Desc</description>
<importance>high</importance>
</gap_suggestion>
What do you think?`;

    const clean = stripStructuredTags(text);
    expect(clean).not.toContain("<gap_suggestion>");
    expect(clean).toContain("Hello!");
    expect(clean).toContain("What do you think?");
  });

  it("removes phase signal tags", () => {
    const text = "Done! <phase_signal>ready_for_outline</phase_signal> Ready?";
    const clean = stripStructuredTags(text);
    expect(clean).not.toContain("<phase_signal>");
    expect(clean).toContain("Done!");
    expect(clean).toContain("Ready?");
  });

  it("removes multiple tags and collapses whitespace", () => {
    const text = `Before
<gap_suggestion>
<area>A</area>
<description>B</description>
<importance>high</importance>
</gap_suggestion>


<phase_signal>test</phase_signal>


After`;

    const clean = stripStructuredTags(text);
    expect(clean).not.toContain("<gap_suggestion>");
    expect(clean).not.toContain("<phase_signal>");
    // Should not have excessive blank lines
    expect(clean).not.toContain("\n\n\n");
  });

  it("returns original text when no tags present", () => {
    const text = "No tags here, just text.";
    const clean = stripStructuredTags(text);
    expect(clean).toBe("No tags here, just text.");
  });
});
