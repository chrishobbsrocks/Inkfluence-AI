"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { EditableChapterItem } from "./editable-chapter-item";
import { AddChapterButton } from "./add-chapter-button";
import type {
  EditorSection,
  SaveStatus,
  OutlineEditorAction,
} from "@/hooks/use-outline-editor";

interface OutlineEditorProps {
  sections: EditorSection[];
  dispatch: React.Dispatch<OutlineEditorAction>;
  saveStatus: SaveStatus;
}

export function OutlineEditor({
  sections,
  dispatch,
  saveStatus,
}: OutlineEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      dispatch({ type: "REORDER", fromIndex: oldIndex, toIndex: newIndex });
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
          Chapters ({sections.length})
        </p>
        <span className="text-[10px] text-stone-400">
          {saveStatus === "saving" && "Saving..."}
          {saveStatus === "saved" && "Saved"}
          {saveStatus === "error" && "Error saving"}
        </span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={sections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {sections.map((section, i) => (
            <EditableChapterItem
              key={section.id}
              section={section}
              chapterNumber={i + 1}
              dispatch={dispatch}
            />
          ))}
        </SortableContext>
      </DndContext>

      <AddChapterButton
        onClick={() => dispatch({ type: "ADD_CHAPTER" })}
      />
    </div>
  );
}
