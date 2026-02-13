"use client";

import { useState, type FormEvent } from "react";
import { Send, Mic, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isStreaming: boolean;
  questionCount: number;
  totalQuestions: number;
}

export function ChatInput({
  onSendMessage,
  isStreaming,
  questionCount,
  totalQuestions,
}: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;
    onSendMessage(trimmed);
    setInput("");
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your response..."
          className="flex-1 h-10 px-3.5 border-stone-200 bg-white text-sm placeholder:text-stone-400 focus:ring-2 focus:ring-stone-300"
          disabled={isStreaming}
        />
        <Button
          type="submit"
          className="h-10 px-4 bg-stone-900 hover:bg-stone-800 gap-1.5"
          disabled={isStreaming || !input.trim()}
        >
          <Send className="w-3.5 h-3.5" />
          Send
        </Button>
      </form>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[11px] gap-1"
              disabled
            >
              <Mic className="w-3 h-3" />
              Record
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Coming soon</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[11px] gap-1"
              disabled
            >
              <Paperclip className="w-3 h-3" />
              Upload notes
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Coming soon</p>
          </TooltipContent>
        </Tooltip>
        <span className="ml-auto text-[11px] text-stone-400">
          Question {questionCount} of ~{totalQuestions}
        </span>
      </div>
    </div>
  );
}
