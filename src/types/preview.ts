export interface BookTemplate {
  id: string;
  name: string;
  fonts: { heading: string; body: string };
  fontSize: number;
  margins: { top: number; right: number; bottom: number; left: number };
  colors: { heading: string; body: string; accent: string };
  spacing: { paragraph: number; heading: number };
}

export type PreviewTab = "preview" | "cover" | "toc";

/** The subset of chapter data needed for preview */
export interface PreviewChapter {
  id: string;
  title: string;
  content: string | null;
  orderIndex: number;
  wordCount: number;
}
