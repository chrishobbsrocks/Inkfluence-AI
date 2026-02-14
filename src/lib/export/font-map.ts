const FONT_MAP: Record<string, string> = {
  "var(--font-body)": "Helvetica",
  "var(--font-heading)": "Times-Roman",
  "Georgia, serif": "Times-Roman",
};

/**
 * Maps CSS font references (CSS variables, font stacks) to
 * @react-pdf/renderer built-in font names.
 *
 * We use built-in PDF fonts to avoid network font downloads in serverless.
 * Helvetica ≈ DM Sans (clean sans-serif), Times-Roman ≈ Instrument Serif (serif).
 */
export function resolveFontFamily(cssFont: string): string {
  return FONT_MAP[cssFont] ?? "Helvetica";
}

/**
 * Maps CSS font references to readable display names for EPUB CSS.
 */
export function resolveEpubFontFamily(cssFont: string): string {
  const EPUB_MAP: Record<string, string> = {
    "var(--font-body)": '"Helvetica Neue", "DM Sans", sans-serif',
    "var(--font-heading)": '"Georgia", "Instrument Serif", serif',
    "Georgia, serif": '"Georgia", serif',
  };
  return EPUB_MAP[cssFont] ?? "sans-serif";
}
