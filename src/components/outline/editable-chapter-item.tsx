"use client";

import { useState, useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, MoreHorizontal, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditableSubSection } from "./editable-sub-section";
import type { EditorSection, OutlineEditorAction } from "@/hooks/use-outline-editor";

interface EditableChapterItemProps {
  section: EditorSection;
  chapterNumber: number;
  dispatch: React.Dispatch<OutlineEditorAction>;
}

export function EditableChapterItem({
  section,
  chapterNumber,
  dispatch,
}: EditableChapterItemProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitleValue, setEditTitleValue] = useState(section.chapterTitle);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    if (isEditingTitle) titleInputRef.current?.select();
  }, [isEditingTitle]);

  useEffect(() => {
    setEditTitleValue(section.chapterTitle);
  }, [section.chapterTitle]);

  function handleTitleSave() {
    const trimmed = editTitleValue.trim();
    if (trimmed && trimmed !== section.chapterTitle) {
      dispatch({
        type: "UPDATE_TITLE",
        sectionId: section.id,
        title: trimmed,
      });
    } else {
      setEditTitleValue(section.chapterTitle);
    }
    setIsEditingTitle(false);
  }

  function handleRemove() {
    dispatch({ type: "REMOVE_CHAPTER", sectionId: section.id });
  }

  function handleAddSubSection() {
    dispatch({ type: "ADD_SUB_SECTION", sectionId: section.id });
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group rounded-lg border bg-white px-3.5 py-2.5 ${
        section.aiSuggested
          ? "border-amber-200 bg-amber-50/30"
          : "border-stone-200"
      } ${isDragging ? "opacity-50 shadow-lg z-10" : ""}`}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="shrink-0 cursor-grab active:cursor-grabbing touch-none"
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-3.5 h-3.5 text-stone-300" />
        </button>

        <span className="text-[10px] font-mono font-semibold text-stone-400 w-5">
          {String(chapterNumber).padStart(2, "0")}
        </span>

        {isEditingTitle ? (
          <input
            ref={titleInputRef}
            value={editTitleValue}
            onChange={(e) => setEditTitleValue(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleTitleSave();
              if (e.key === "Escape") {
                setEditTitleValue(section.chapterTitle);
                setIsEditingTitle(false);
              }
            }}
            className="text-sm font-medium text-stone-800 flex-1 bg-transparent border-b border-stone-300 outline-none"
            autoFocus
          />
        ) : (
          <span
            onClick={() => setIsEditingTitle(true)}
            className="text-sm font-medium text-stone-800 flex-1 cursor-text"
          >
            {section.chapterTitle}
          </span>
        )}

        {section.aiSuggested && (
          <Badge
            variant="outline"
            className="text-[9px] border-amber-300 text-amber-600 bg-amber-50"
          >
            AI suggested
          </Badge>
        )}

        <span className="text-[10px] text-stone-400 shrink-0">
          ~{Math.max(section.keyPoints.length * 800, 500)} words
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-stone-600 transition-opacity shrink-0"
              aria-label="Chapter options"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditingTitle(true)}>
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleRemove}
              className="text-red-600 focus:text-red-600"
            >
              Remove Chapter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Sub-sections */}
      {section.keyPoints.length > 0 && (
        <div className="ml-[3.25rem] mt-2 space-y-1 border-l-2 border-stone-100 pl-3">
          {section.keyPoints.map((point, i) => (
            <EditableSubSection
              key={`${section.id}-sub-${i}`}
              text={point}
              onUpdate={(text) =>
                dispatch({
                  type: "UPDATE_SUB_SECTION",
                  sectionId: section.id,
                  subIndex: i,
                  text,
                })
              }
              onRemove={() =>
                dispatch({
                  type: "REMOVE_SUB_SECTION",
                  sectionId: section.id,
                  subIndex: i,
                })
              }
            />
          ))}
        </div>
      )}

      {/* Add sub-section link */}
      <button
        type="button"
        onClick={handleAddSubSection}
        className="ml-[3.25rem] mt-1.5 flex items-center gap-1 text-[11px] text-stone-400 hover:text-stone-600 transition-colors"
      >
        <Plus className="w-2.5 h-2.5" />
        Add sub-section
      </button>
    </div>
  );
}
