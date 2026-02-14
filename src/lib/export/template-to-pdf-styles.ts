import { StyleSheet } from "@react-pdf/renderer";
import { resolveFontFamily } from "./font-map";
import type { BookTemplate } from "@/types/preview";

export function createPdfStyles(template: BookTemplate) {
  const bodyFont = resolveFontFamily(template.fonts.body);
  const headingFont = resolveFontFamily(template.fonts.heading);

  return StyleSheet.create({
    page: {
      paddingTop: template.margins.top,
      paddingRight: template.margins.right,
      paddingBottom: template.margins.bottom,
      paddingLeft: template.margins.left,
      fontFamily: bodyFont,
      fontSize: template.fontSize,
      color: template.colors.body,
    },
    titlePage: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    bookTitle: {
      fontFamily: headingFont,
      fontSize: template.fontSize + 12,
      color: template.colors.heading,
      textAlign: "center",
      marginBottom: 16,
    },
    authorName: {
      fontFamily: bodyFont,
      fontSize: template.fontSize + 2,
      color: template.colors.accent,
      textAlign: "center",
    },
    tocTitle: {
      fontFamily: headingFont,
      fontSize: template.fontSize + 6,
      color: template.colors.heading,
      marginBottom: template.spacing.heading,
      textAlign: "center",
    },
    tocEntry: {
      fontFamily: bodyFont,
      fontSize: template.fontSize,
      color: template.colors.body,
      marginBottom: 8,
    },
    chapterTitle: {
      fontFamily: headingFont,
      fontSize: template.fontSize + 6,
      color: template.colors.heading,
      marginBottom: template.spacing.heading,
      fontWeight: 700,
    },
    heading2: {
      fontFamily: headingFont,
      fontSize: template.fontSize + 4,
      color: template.colors.heading,
      fontWeight: 700,
      marginTop: template.spacing.heading,
      marginBottom: template.spacing.paragraph,
    },
    heading3: {
      fontFamily: headingFont,
      fontSize: template.fontSize + 2,
      color: template.colors.heading,
      fontWeight: 700,
      marginTop: Math.round(template.spacing.heading * 0.75),
      marginBottom: Math.round(template.spacing.paragraph * 0.75),
    },
    paragraph: {
      marginBottom: template.spacing.paragraph,
      lineHeight: 1.6,
    },
    bold: {
      fontWeight: 700,
    },
    italic: {
      fontStyle: "italic",
    },
    underline: {
      textDecoration: "underline",
    },
    blockquote: {
      borderLeftWidth: 3,
      borderLeftColor: template.colors.accent,
      paddingLeft: 12,
      marginLeft: 0,
      marginBottom: template.spacing.paragraph,
      fontStyle: "italic",
      color: template.colors.accent,
    },
    listItem: {
      flexDirection: "row",
      marginBottom: 4,
    },
    listBullet: {
      width: 16,
      fontFamily: bodyFont,
    },
    listContent: {
      flex: 1,
    },
  });
}

export type PdfStyles = ReturnType<typeof createPdfStyles>;
