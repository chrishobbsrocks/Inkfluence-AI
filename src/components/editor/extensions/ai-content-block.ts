import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { AiContentBlockView } from "./ai-content-block-view";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    aiContentBlock: {
      setAiContentBlock: () => ReturnType;
      unsetAiContentBlock: () => ReturnType;
    };
  }

  interface Storage {
    aiContentBlock: {
      onRegenerate: (() => void) | undefined;
    };
  }
}

export const AiContentBlock = Node.create({
  name: "aiContentBlock",
  group: "block",
  content: "block+",
  defining: true,

  addAttributes() {
    return {
      generatedAt: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-generated-at"),
        renderHTML: (attributes) => ({
          "data-generated-at": attributes.generatedAt as string,
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-ai-content="true"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-ai-content": "true",
        class:
          "ai-content-block border-l-4 border-amber-400 pl-4 my-4 bg-amber-50/30 rounded-r",
      }),
      0,
    ];
  },

  addStorage() {
    return {
      onRegenerate: undefined as (() => void) | undefined,
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(AiContentBlockView);
  },

  addCommands() {
    return {
      setAiContentBlock:
        () =>
        ({ commands }) => {
          return commands.wrapIn(this.name, {
            generatedAt: new Date().toISOString(),
          });
        },
      unsetAiContentBlock:
        () =>
        ({ commands }) => {
          return commands.lift(this.name);
        },
    };
  },
});
