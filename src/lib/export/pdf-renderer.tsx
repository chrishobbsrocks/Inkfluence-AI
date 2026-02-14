import React from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { renderToBuffer } from "@react-pdf/renderer";
import { createPdfStyles } from "./template-to-pdf-styles";
import { htmlToPdfElements } from "./html-to-pdf-elements";
import type { BookTemplate } from "@/types/preview";
import type { ExportBookData, ExportChapter } from "./types";

export async function generatePdfBuffer(
  book: ExportBookData,
  chapters: ExportChapter[],
  template: BookTemplate
): Promise<Buffer> {
  const styles = createPdfStyles(template);

  const doc = (
    <Document
      title={book.title}
      author={book.authorName ?? "Unknown Author"}
      creator="Inkfluence AI"
    >
      {/* Title page */}
      <Page size="A5" style={styles.page}>
        <View style={styles.titlePage}>
          <Text style={styles.bookTitle}>{book.title}</Text>
          {book.authorName && (
            <Text style={styles.authorName}>{book.authorName}</Text>
          )}
        </View>
      </Page>

      {/* Table of Contents */}
      <Page size="A5" style={styles.page}>
        <Text style={styles.tocTitle}>Table of Contents</Text>
        {chapters.map((ch, i) => (
          <Text key={ch.id} style={styles.tocEntry}>
            {i + 1}. {ch.title}
          </Text>
        ))}
      </Page>

      {/* Chapter pages */}
      {chapters.map((chapter) => (
        <Page key={chapter.id} size="A5" style={styles.page} wrap>
          <Text style={styles.chapterTitle}>{chapter.title}</Text>
          {chapter.content ? (
            htmlToPdfElements(chapter.content, styles)
          ) : (
            <Text style={styles.paragraph}>No content.</Text>
          )}
        </Page>
      ))}
    </Document>
  );

  return renderToBuffer(doc);
}
