export type PlatformCode = "KDP" | "AB" | "GP" | "KO";

export type PlatformStatus = "draft" | "submitted" | "published" | "rejected";

export type PlatformExportFormat = "pdf" | "epub";

export interface PlatformDefinition {
  code: PlatformCode;
  name: string;
  exportFormat: PlatformExportFormat;
  guidelines: string;
}

export const PLATFORM_DEFINITIONS: PlatformDefinition[] = [
  {
    code: "KDP",
    name: "Amazon KDP",
    exportFormat: "pdf",
    guidelines:
      "Upload at kdp.amazon.com \u2192 Your Bookshelf \u2192 Create New Title. Upload PDF interior and cover separately.",
  },
  {
    code: "AB",
    name: "Apple Books",
    exportFormat: "epub",
    guidelines:
      "Upload EPUB through Apple Books for Authors at authors.apple.com. Include cover in EPUB metadata.",
  },
  {
    code: "GP",
    name: "Google Play Books",
    exportFormat: "epub",
    guidelines:
      "Upload EPUB via Google Play Books Partner Center at play.google.com/books/publish.",
  },
  {
    code: "KO",
    name: "Kobo",
    exportFormat: "epub",
    guidelines:
      "Upload EPUB through Kobo Writing Life at writinglife.kobobooks.com.",
  },
];

export interface PlatformCardData {
  id: string | null;
  code: PlatformCode;
  name: string;
  connected: boolean;
  selected: boolean;
  status: PlatformStatus;
  submittedAt: string | null;
  publishedAt: string | null;
  guidelines: string;
}
