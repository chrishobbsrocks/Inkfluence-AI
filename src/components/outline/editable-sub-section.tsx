"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

interface EditableSubSectionProps {
  text: string;
  onUpdate: (text: string) => void;
  onRemove: () => void;
}

export function EditableSubSection({
  text,
  onUpdate,
  onRemove,
}: EditableSubSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.select();
  }, [isEditing]);

  function handleSave() {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== text) {
      onUpdate(trimmed);
    } else {
      setEditValue(text);
    }
    setIsEditing(false);
  }

  return (
    <div className="group/sub flex items-start gap-1.5">
      {isEditing ? (
        <input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") {
              setEditValue(text);
              setIsEditing(false);
            }
          }}
          className="flex-1 text-[12px] text-stone-500 leading-relaxed bg-transparent border-b border-stone-300 outline-none"
          autoFocus
        />
      ) : (
        <p
          onClick={() => setIsEditing(true)}
          className="flex-1 text-[12px] text-stone-500 leading-relaxed cursor-text hover:text-stone-700 transition-colors"
        >
          {text}
        </p>
      )}
      <button
        type="button"
        onClick={onRemove}
        className="opacity-0 group-hover/sub:opacity-100 p-0.5 text-stone-300 hover:text-stone-500 transition-opacity shrink-0"
        aria-label="Remove sub-section"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
