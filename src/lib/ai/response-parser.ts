import type { GapSuggestion } from "@/types/wizard";

const GAP_SUGGESTION_REGEX =
  /<gap_suggestion>\s*<area>([\s\S]*?)<\/area>\s*<description>([\s\S]*?)<\/description>\s*<importance>(high|medium|low)<\/importance>\s*<\/gap_suggestion>/gi;

const PHASE_SIGNAL_REGEX = /<phase_signal>([\s\S]*?)<\/phase_signal>/i;

const ALL_TAGS_REGEX =
  /<gap_suggestion>[\s\S]*?<\/gap_suggestion>|<phase_signal>[\s\S]*?<\/phase_signal>/gi;

/** Extract gap suggestions from Claude's response text */
export function parseGapSuggestions(text: string): GapSuggestion[] {
  const gaps: GapSuggestion[] = [];
  let match;

  // Reset regex lastIndex
  GAP_SUGGESTION_REGEX.lastIndex = 0;

  while ((match = GAP_SUGGESTION_REGEX.exec(text)) !== null) {
    const importance = match[3]?.trim().toLowerCase();
    if (
      importance === "high" ||
      importance === "medium" ||
      importance === "low"
    ) {
      gaps.push({
        area: match[1]!.trim(),
        description: match[2]!.trim(),
        importance,
      });
    }
  }

  return gaps;
}

/** Extract phase signal from Claude's response text */
export function parsePhaseSignal(text: string): string | null {
  const match = PHASE_SIGNAL_REGEX.exec(text);
  return match ? match[1]!.trim() : null;
}

/** Remove all structured XML tags from text for clean display */
export function stripStructuredTags(text: string): string {
  return text.replace(ALL_TAGS_REGEX, "").replace(/\n{3,}/g, "\n\n").trim();
}
