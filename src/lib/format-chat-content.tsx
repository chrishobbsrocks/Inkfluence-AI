import type { ReactNode } from "react";

/**
 * Convert minimal markdown in chat messages to React elements.
 * Handles **bold** text and paragraph breaks (\n\n).
 */
export function formatChatContent(text: string): ReactNode[] {
  const paragraphs = text.split(/\n{2,}/);

  return paragraphs.map((paragraph, pIdx) => {
    // Split on **bold** markers
    const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);
    const elements = parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold text-stone-800">
            {part.slice(2, -2)}
          </strong>
        );
      }
      // Preserve single newlines as <br />
      const lines = part.split("\n");
      return lines.map((line, lineIdx) => (
        <span key={`${i}-${lineIdx}`}>
          {line}
          {lineIdx < lines.length - 1 && <br />}
        </span>
      ));
    });

    if (paragraphs.length === 1) {
      return <span key={pIdx}>{elements}</span>;
    }

    return (
      <p key={pIdx} className={pIdx > 0 ? "mt-2" : undefined}>
        {elements}
      </p>
    );
  });
}
