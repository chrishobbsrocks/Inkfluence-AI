import type { BookTemplate } from "@/types/preview";

export const BOOK_TEMPLATES: BookTemplate[] = [
  {
    id: "modern",
    name: "Modern",
    fonts: { heading: "var(--font-body)", body: "var(--font-body)" },
    fontSize: 11,
    margins: { top: 48, right: 32, bottom: 48, left: 32 },
    colors: { heading: "#1c1917", body: "#57534e", accent: "#a8a29e" },
    spacing: { paragraph: 16, heading: 24 },
  },
  {
    id: "classic",
    name: "Classic",
    fonts: { heading: "var(--font-heading)", body: "Georgia, serif" },
    fontSize: 12,
    margins: { top: 56, right: 40, bottom: 56, left: 40 },
    colors: { heading: "#292524", body: "#44403c", accent: "#78716c" },
    spacing: { paragraph: 18, heading: 28 },
  },
  {
    id: "minimal",
    name: "Minimal",
    fonts: { heading: "var(--font-body)", body: "var(--font-body)" },
    fontSize: 10,
    margins: { top: 64, right: 48, bottom: 64, left: 48 },
    colors: { heading: "#44403c", body: "#78716c", accent: "#d6d3d1" },
    spacing: { paragraph: 20, heading: 32 },
  },
  {
    id: "bold",
    name: "Bold",
    fonts: { heading: "var(--font-heading)", body: "var(--font-body)" },
    fontSize: 11,
    margins: { top: 40, right: 28, bottom: 40, left: 28 },
    colors: { heading: "#0c0a09", body: "#1c1917", accent: "#dc2626" },
    spacing: { paragraph: 14, heading: 20 },
  },
];

export const DEFAULT_TEMPLATE_ID = "modern";
