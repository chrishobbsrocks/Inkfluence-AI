"use client";

import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { Check, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AiContentBlockViewProps {
  deleteNode: () => void;
  editor: {
    commands: {
      unsetAiContentBlock: () => boolean;
    };
    storage: {
      aiContentBlock?: {
        onRegenerate?: () => void;
      };
    };
  };
}

export function AiContentBlockView({
  deleteNode,
  editor,
}: AiContentBlockViewProps) {
  const handleAccept = () => {
    editor.commands.unsetAiContentBlock();
  };

  const handleRegenerate = () => {
    editor.storage.aiContentBlock?.onRegenerate?.();
  };

  const handleDiscard = () => {
    deleteNode();
  };

  return (
    <NodeViewWrapper className="ai-content-block border-l-4 border-amber-400 pl-4 my-4 bg-amber-50/30 rounded-r relative group">
      {/* Action bar - visible on hover */}
      <div className="absolute -top-3 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Button
          type="button"
          size="sm"
          onClick={handleAccept}
          className="h-6 text-[10px] px-2 bg-stone-900 hover:bg-stone-800"
          aria-label="Accept AI content"
        >
          <Check className="w-3 h-3 mr-1" />
          Accept
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleRegenerate}
          className="h-6 text-[10px] px-2"
          aria-label="Regenerate AI content"
        >
          <RefreshCw className="w-3 h-3" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleDiscard}
          className="h-6 text-[10px] px-2 text-stone-400 hover:text-stone-600"
          aria-label="Discard AI content"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
      <NodeViewContent />
    </NodeViewWrapper>
  );
}
