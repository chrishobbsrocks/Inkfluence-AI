"use client";

import { useRef, useEffect } from "react";

interface ChapterTitleInputProps {
  title: string;
  onTitleChange: (title: string) => void;
}

export function ChapterTitleInput({
  title,
  onTitleChange,
}: ChapterTitleInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== title) {
      inputRef.current.value = title;
    }
  }, [title]);

  return (
    <input
      ref={inputRef}
      defaultValue={title}
      onChange={(e) => onTitleChange(e.target.value)}
      className="w-full font-serif text-3xl font-bold text-stone-900 bg-transparent border-none outline-none placeholder:text-stone-300"
      placeholder="Chapter title..."
    />
  );
}
