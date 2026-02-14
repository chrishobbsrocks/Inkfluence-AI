/** Count words in an HTML string by stripping tags and splitting on whitespace */
export function countWords(text: string): number {
  if (!text) return 0;
  const stripped = text.replace(/<[^>]*>/g, " ").trim();
  if (!stripped) return 0;
  return stripped.split(/\s+/).length;
}
