/** Build the metadata generation prompt */
export function buildMetadataGenerationPrompt(
  bookTitle: string,
  bookTopic: string,
  audience: string | null,
  chapterTitles: string[],
  totalWordCount: number
): string {
  const chapterList = chapterTitles
    .map((title, i) => `${i + 1}. ${title}`)
    .join("\n");

  return `You are a book publishing metadata specialist for Inkfluence AI.

Generate publishing metadata for the following ebook.

## Book Details
- Title: ${bookTitle}
- Topic: ${bookTopic}
- Target Audience: ${audience ?? "General readers interested in the topic"}
- Total Word Count: ${totalWordCount}

## Chapter Titles
${chapterList || "No chapters available"}

## Instructions
Generate the following metadata:

1. **Description**: Write a compelling book description of approximately 150 words. It should hook potential readers, highlight key benefits, and include a call-to-action. Write in third person.

2. **Keywords**: Provide up to 7 relevant keyword tags that potential readers would search for. Focus on specific, discoverable terms (not generic ones like "book" or "ebook").

3. **Category**: Suggest the single most appropriate category from this list:
   Business & Money, Self-Help, Health & Fitness, Technology, Education & Teaching, Science & Nature, Arts & Photography, Biographies & Memoirs, Cooking & Food, History, Religion & Spirituality, Travel, Parenting & Relationships, Politics & Social Sciences, Other`;
}

/** Claude tool_use schema for metadata generation */
export const metadataGenerationTool = {
  name: "generate_book_metadata" as const,
  description:
    "Generate publishing metadata for an ebook including description, keywords, and category",
  input_schema: {
    type: "object" as const,
    properties: {
      description: {
        type: "string" as const,
        description:
          "A compelling book description of approximately 150 words",
      },
      keywords: {
        type: "array" as const,
        items: { type: "string" as const },
        description: "Up to 7 relevant keyword tags for discoverability",
      },
      category: {
        type: "string" as const,
        description: "The most appropriate ebook category",
      },
    },
    required: ["description", "keywords", "category"],
  },
};
