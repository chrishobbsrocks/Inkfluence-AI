import React from "react";
import { Text, View, Link } from "@react-pdf/renderer";
import { parse, type Node, NodeType } from "node-html-parser";
import type { PdfStyles } from "./template-to-pdf-styles";

/**
 * Converts Tiptap HTML content to @react-pdf/renderer elements.
 *
 * Tiptap produces a limited, well-known subset of HTML:
 * <p>, <h1>-<h6>, <strong>, <em>, <u>, <ul>, <ol>, <li>,
 * <a>, <br>, <blockquote>
 */
export function htmlToPdfElements(
  html: string,
  styles: PdfStyles
): React.ReactNode[] {
  if (!html || !html.trim()) return [];

  const root = parse(html);
  return processChildren(root.childNodes, styles, 0);
}

function getTag(node: Node): string | null {
  if (node.nodeType !== NodeType.ELEMENT_NODE) return null;
  // node-html-parser's HTMLElement has tagName
  return (node as unknown as { tagName?: string }).tagName?.toLowerCase() ?? null;
}

function getAttr(node: Node, name: string): string | null {
  if (node.nodeType !== NodeType.ELEMENT_NODE) return null;
  return (node as unknown as { getAttribute?: (n: string) => string | undefined }).getAttribute?.(name) ?? null;
}

function getChildNodes(node: Node): Node[] {
  return node.childNodes;
}

function getTextContent(node: Node): string {
  return node.textContent ?? "";
}

function processChildren(
  nodes: Node[],
  styles: PdfStyles,
  keyBase: number
): React.ReactNode[] {
  const elements: React.ReactNode[] = [];
  let listCounter = 0;

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]!;
    const key = `${keyBase}-${i}`;

    if (node.nodeType === NodeType.TEXT_NODE) {
      const text = node.rawText;
      if (text.trim()) {
        elements.push(<Text key={key}>{text}</Text>);
      }
      continue;
    }

    if (node.nodeType !== NodeType.ELEMENT_NODE) continue;

    const tag = getTag(node);

    switch (tag) {
      case "p":
        elements.push(
          <Text key={key} style={styles.paragraph}>
            {processInlineChildren(getChildNodes(node), styles, i * 100)}
          </Text>
        );
        break;

      case "h1":
        elements.push(
          <Text key={key} style={styles.chapterTitle}>
            {getTextContent(node)}
          </Text>
        );
        break;

      case "h2":
        elements.push(
          <Text key={key} style={styles.heading2}>
            {getTextContent(node)}
          </Text>
        );
        break;

      case "h3":
        elements.push(
          <Text key={key} style={styles.heading3}>
            {getTextContent(node)}
          </Text>
        );
        break;

      case "h4":
      case "h5":
      case "h6":
        elements.push(
          <Text key={key} style={styles.heading3}>
            {getTextContent(node)}
          </Text>
        );
        break;

      case "blockquote":
        elements.push(
          <View key={key} style={styles.blockquote}>
            {processChildren(getChildNodes(node), styles, i * 100)}
          </View>
        );
        break;

      case "ul":
        listCounter = 0;
        elements.push(
          <View key={key}>
            {getChildNodes(node)
              .filter(
                (child) => child.nodeType === NodeType.ELEMENT_NODE && getTag(child) === "li"
              )
              .map((li, liIdx) => (
                <View key={`${key}-li-${liIdx}`} style={styles.listItem}>
                  <Text style={styles.listBullet}>{"•  "}</Text>
                  <Text style={styles.listContent}>
                    {processInlineChildren(getChildNodes(li), styles, liIdx * 10)}
                  </Text>
                </View>
              ))}
          </View>
        );
        break;

      case "ol":
        listCounter = 0;
        elements.push(
          <View key={key}>
            {getChildNodes(node)
              .filter(
                (child) => child.nodeType === NodeType.ELEMENT_NODE && getTag(child) === "li"
              )
              .map((li, liIdx) => {
                listCounter++;
                return (
                  <View key={`${key}-li-${liIdx}`} style={styles.listItem}>
                    <Text style={styles.listBullet}>{`${listCounter}. `}</Text>
                    <Text style={styles.listContent}>
                      {processInlineChildren(getChildNodes(li), styles, liIdx * 10)}
                    </Text>
                  </View>
                );
              })}
          </View>
        );
        break;

      default:
        elements.push(...processChildren(getChildNodes(node), styles, i * 100));
        break;
    }
  }

  return elements;
}

function processInlineChildren(
  nodes: Node[],
  styles: PdfStyles,
  keyBase: number
): React.ReactNode[] {
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]!;
    const key = `inline-${keyBase}-${i}`;

    if (node.nodeType === NodeType.TEXT_NODE) {
      elements.push(node.rawText);
      continue;
    }

    if (node.nodeType !== NodeType.ELEMENT_NODE) continue;

    const tag = getTag(node);

    switch (tag) {
      case "strong":
      case "b":
        elements.push(
          <Text key={key} style={styles.bold}>
            {processInlineChildren(getChildNodes(node), styles, i * 10)}
          </Text>
        );
        break;

      case "em":
      case "i":
        elements.push(
          <Text key={key} style={styles.italic}>
            {processInlineChildren(getChildNodes(node), styles, i * 10)}
          </Text>
        );
        break;

      case "u":
        elements.push(
          <Text key={key} style={styles.underline}>
            {processInlineChildren(getChildNodes(node), styles, i * 10)}
          </Text>
        );
        break;

      case "a": {
        const href = getAttr(node, "href") ?? "";
        elements.push(
          <Link key={key} src={href}>
            {getTextContent(node)}
          </Link>
        );
        break;
      }

      case "br":
        elements.push("\n");
        break;

      default:
        elements.push(
          ...processInlineChildren(getChildNodes(node), styles, i * 10)
        );
        break;
    }
  }

  return elements;
}
