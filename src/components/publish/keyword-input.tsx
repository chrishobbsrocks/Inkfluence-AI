"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const MAX_KEYWORDS = 7;

export interface KeywordInputProps {
  keywords: string[];
  onChange: (keywords: string[]) => void;
  disabled?: boolean;
}

export function KeywordInput({
  keywords,
  onChange,
  disabled = false,
}: KeywordInputProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState("");

  function handleRemove(index: number) {
    onChange(keywords.filter((_, i) => i !== index));
  }

  function handleAdd() {
    const trimmed = inputValue.trim();
    if (trimmed && keywords.length < MAX_KEYWORDS && !keywords.includes(trimmed)) {
      onChange([...keywords, trimmed]);
    }
    setInputValue("");
    setIsAdding(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    } else if (e.key === "Escape") {
      setInputValue("");
      setIsAdding(false);
    }
  }

  return (
    <div className="flex gap-1.5 flex-wrap">
      {keywords.map((keyword, i) => (
        <Badge
          key={keyword}
          variant="secondary"
          className="text-[10px] gap-1"
        >
          {keyword}
          {!disabled && (
            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="ml-0.5 hover:text-stone-900"
              aria-label={`Remove ${keyword}`}
            >
              <X className="w-2.5 h-2.5" />
            </button>
          )}
        </Badge>
      ))}
      {keywords.length < MAX_KEYWORDS && !disabled && (
        <>
          {isAdding ? (
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleAdd}
              onKeyDown={handleKeyDown}
              className="h-6 w-28 text-[10px] px-2"
              placeholder="Add keyword"
              autoFocus
            />
          ) : (
            <Badge
              variant="outline"
              className="text-[10px] cursor-pointer"
              onClick={() => setIsAdding(true)}
            >
              + Add
            </Badge>
          )}
        </>
      )}
    </div>
  );
}
