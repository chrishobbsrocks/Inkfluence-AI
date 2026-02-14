import { resolveEpubFontFamily } from "./font-map";
import type { BookTemplate } from "@/types/preview";

/**
 * Maps a BookTemplate to a CSS string for EPUB chapter styling.
 */
export function createEpubCss(template: BookTemplate): string {
  const bodyFont = resolveEpubFontFamily(template.fonts.body);
  const headingFont = resolveEpubFontFamily(template.fonts.heading);

  return `
body {
  font-family: ${bodyFont};
  font-size: ${template.fontSize}pt;
  color: ${template.colors.body};
  line-height: 1.6;
  margin: ${template.margins.top}px ${template.margins.right}px ${template.margins.bottom}px ${template.margins.left}px;
}

h1, h2, h3, h4, h5, h6 {
  font-family: ${headingFont};
  color: ${template.colors.heading};
}

h1 {
  font-size: ${template.fontSize + 6}pt;
  margin-bottom: ${template.spacing.heading}px;
}

h2 {
  font-size: ${template.fontSize + 4}pt;
  margin-top: ${template.spacing.heading}px;
  margin-bottom: ${template.spacing.paragraph}px;
}

h3 {
  font-size: ${template.fontSize + 2}pt;
  margin-top: ${Math.round(template.spacing.heading * 0.75)}px;
  margin-bottom: ${Math.round(template.spacing.paragraph * 0.75)}px;
}

p {
  margin-bottom: ${template.spacing.paragraph}px;
}

blockquote {
  border-left: 3px solid ${template.colors.accent};
  padding-left: 16px;
  margin-left: 0;
  font-style: italic;
  color: ${template.colors.accent};
}

strong, b {
  font-weight: 700;
}

em, i {
  font-style: italic;
}

ul, ol {
  padding-left: 24px;
  margin-bottom: ${template.spacing.paragraph}px;
}

li {
  margin-bottom: 4px;
}
`.trim();
}
