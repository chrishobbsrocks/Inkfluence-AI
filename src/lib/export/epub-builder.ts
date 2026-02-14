import { createEpubCss } from "./template-to-epub-css";
import type { BookTemplate } from "@/types/preview";
import type { ExportBookData, ExportChapter } from "./types";

interface EpubOptions {
  title: string;
  author: string;
  publisher: string;
  css: string;
  tocTitle: string;
}

interface EpubContent {
  title: string;
  data: string;
}

interface EpubInstance {
  genEpub(): Promise<ArrayBuffer>;
}

export async function generateEpubBuffer(
  book: ExportBookData,
  chapters: ExportChapter[],
  template: BookTemplate
): Promise<Buffer> {
  const css = createEpubCss(template);

  const content: EpubContent[] = chapters.map((chapter) => ({
    title: chapter.title,
    data: chapter.content ?? "<p>No content.</p>",
  }));

  const options: EpubOptions = {
    title: book.title,
    author: book.authorName ?? "Unknown Author",
    publisher: "Inkfluence AI",
    css,
    tocTitle: "Table of Contents",
  };

  // epub-gen-memory exports { default: class EPub }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const EPubModule = await import("epub-gen-memory");
  const EPub = EPubModule.default as unknown as new (
    opts: EpubOptions,
    content: EpubContent[]
  ) => EpubInstance;

  const epub = new EPub(options, content);
  const epubBuffer = await epub.genEpub();
  return Buffer.from(epubBuffer);
}
