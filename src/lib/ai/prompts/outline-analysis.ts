interface AnalysisChapter {
  chapterTitle: string;
  keyPoints: string[];
}

export function buildOutlineAnalysisPrompt(
  chapters: AnalysisChapter[],
  topic: string,
  audience: string | null
): string {
  const chapterList = chapters
    .map(
      (ch, i) =>
        `${i + 1}. ${ch.chapterTitle}\n   Key points: ${ch.keyPoints.join(", ") || "None"}`
    )
    .join("\n");

  return `You are an expert book editor and content strategist for Inkfluence AI.

Analyze the following book outline and provide recommendations for improvement.

## Book Topic
${topic}

## Target Audience
${audience ?? "General readers interested in the topic"}

## Current Outline
${chapterList}

## Instructions
Analyze this outline for:
1. **Coverage gaps** — Important topics that are missing or underrepresented
2. **Suggested chapters** — New chapters that would strengthen the book
3. **Coverage assessment** — How well each major topic area is covered

For each suggested chapter:
- Provide a clear, descriptive title
- List 3-5 key points the chapter should cover
- Explain why this chapter would improve the book
- Indicate where it should be inserted (as a 0-based index of the chapter it should follow; use -1 to insert at the beginning)
- Rate priority as "high", "medium", or "low"

For coverage assessment:
- Identify 4-8 major topic areas relevant to the book
- Rate each as "well-covered", "partial", or "gap"

Provide an overall completeness score from 0-100.`;
}

export const outlineAnalysisTool = {
  name: "analyze_outline" as const,
  description:
    "Analyze a book outline and provide suggestions for improvement, coverage assessment, and completeness score",
  input_schema: {
    type: "object" as const,
    properties: {
      suggestions: {
        type: "array" as const,
        items: {
          type: "object" as const,
          properties: {
            chapterTitle: {
              type: "string" as const,
              description: "Suggested chapter title",
            },
            keyPoints: {
              type: "array" as const,
              items: { type: "string" as const },
              description: "3-5 key points the chapter should cover",
            },
            rationale: {
              type: "string" as const,
              description: "Why this chapter would improve the book",
            },
            insertAfterIndex: {
              type: "number" as const,
              description:
                "0-based index of the chapter this should be inserted after (-1 for beginning)",
            },
            priority: {
              type: "string" as const,
              enum: ["high", "medium", "low"],
              description: "Priority level of this suggestion",
            },
          },
          required: [
            "chapterTitle",
            "keyPoints",
            "rationale",
            "insertAfterIndex",
            "priority",
          ],
        },
        description: "Suggested new chapters to add",
      },
      coverage: {
        type: "array" as const,
        items: {
          type: "object" as const,
          properties: {
            area: {
              type: "string" as const,
              description: "Topic area name",
            },
            status: {
              type: "string" as const,
              enum: ["well-covered", "partial", "gap"],
              description: "How well this area is covered",
            },
          },
          required: ["area", "status"],
        },
        description: "Coverage assessment of major topic areas",
      },
      overallScore: {
        type: "number" as const,
        description: "Overall completeness score from 0 to 100",
      },
      summary: {
        type: "string" as const,
        description:
          "Brief summary of the analysis and key recommendations",
      },
    },
    required: ["suggestions", "coverage", "overallScore", "summary"],
  },
};
