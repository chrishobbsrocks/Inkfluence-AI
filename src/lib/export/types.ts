export interface ExportBookData {
  id: string;
  title: string;
  authorName: string | null;
}

export interface ExportChapter {
  id: string;
  title: string;
  content: string | null;
  orderIndex: number;
}

export type ExportFormat = "pdf" | "epub";
