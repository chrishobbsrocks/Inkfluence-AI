---
sprint: 8
title: "Outline Editor UI"
type: fullstack
epic: 4
status: done
created: 2026-02-13T13:13:31Z
started: 2026-02-13T15:51:49Z
completed: 2026-02-13
hours: 0.4
workflow_version: "3.1.0"


---

# Sprint 8: Outline Editor UI

## Overview

| Field | Value |
|-------|-------|
| Sprint | 8 |
| Title | Outline Editor UI |
| Type | fullstack |
| Epic | 4 |
| Status | Done |
| Created | 2026-02-13 |
| Started | 2026-02-13 |
| Completed | 2026-02-13 |

## Goal

Build the interactive Outline Editor with drag-and-drop chapter reordering, inline editing, chapter/sub-section CRUD, and debounced auto-save.

## Background

After the Knowledge Wizard generates an outline, users need to refine it. The existing outline display was read-only. This sprint transforms it into a full interactive editor with drag-and-drop, inline editing, and auto-save.

## Requirements

### Functional Requirements

- [x] Chapter list view with chapter numbers (01, 02, etc.)
- [x] Chapter title and estimated word count display
- [x] Sub-sections listed under each chapter with border-l indicator
- [x] Drag-and-drop reordering of chapters (using GripVertical handle)
- [x] Add new chapter (plus button at bottom + header button)
- [x] Remove chapter (via more options dropdown menu)
- [x] Edit chapter title inline (click-to-edit)
- [x] Add/remove sub-sections within chapters
- [x] AI-suggested chapters highlighted with amber styling
- [x] Header buttons wired: "Add Chapter", "Continue to Writing"
- [x] Auto-save with 500ms debounce

### Non-Functional Requirements

- [x] Smooth drag-and-drop via dnd-kit with vertical axis constraint
- [x] Save status indicator (Saving.../Saved/Error)
- [x] Chapter numbers auto-update after reorder

## Dependencies

- **Sprints**: Sprint 7 (generates the outline data)
- **External**: @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, @dnd-kit/modifiers

## Scope

### In Scope

- Interactive outline editor with drag-and-drop
- Chapter and sub-section CRUD
- Inline title editing
- Auto-save with debounce
- Server action for persisting changes

### Out of Scope

- AI Recommendations panel enhancements (Sprint 9)
- Content generation (Sprint 11)

## Technical Approach

Used dnd-kit for drag-and-drop (React 19 compatible, modular). Created a useOutlineEditor hook with useReducer for state management and 500ms debounced auto-save via useEffect. OutlineEditorWrapper orchestrates the header, editor, and AI panel. Server action validates with Zod and calls existing saveOutlineSections mutation.

## Tasks

### Phase 1: Planning
- [x] Review requirements
- [x] Design architecture (Plan agent)
- [x] Clarify requirements (dnd-kit, navigate to /editor, replace read-only display)

### Phase 2: Implementation
- [x] Install dnd-kit packages and shadcn dropdown-menu
- [x] Create Zod validation schemas
- [x] Create server action (saveOutlineEditorAction)
- [x] Create useOutlineEditor hook (reducer + debounced auto-save)
- [x] Create EditableSubSection component
- [x] Create AddChapterButton component
- [x] Create EditableChapterItem component (drag, inline edit, dropdown)
- [x] Create OutlineEditor component (DndContext wrapper)
- [x] Create OutlineEditorWrapper component (orchestrator)
- [x] Update OutlineHeader (client component, onClick handlers)
- [x] Update outline page to use OutlineEditorWrapper
- [x] Update barrel exports
- [x] Extend saveOutlineSections mutation for per-chapter aiSuggested

### Phase 3: Validation
- [x] Write reducer unit tests (18 tests)
- [x] Write server action tests (7 tests)
- [x] Write component tests (21 tests)
- [x] Run full test suite (261 passing, 0 failures)

### Phase 4: Commit
- [x] Git commit

## Acceptance Criteria

- [x] Chapters display with numbers, titles, word estimates, sub-sections
- [x] Drag-and-drop reorders chapters and updates numbers
- [x] Can add new chapters at end of list and via header button
- [x] Can remove chapters via context menu (prevents removing last chapter)
- [x] Can edit chapter titles inline (click, blur/Enter saves, Escape reverts)
- [x] Can add/remove sub-sections within chapters
- [x] AI-suggested chapters show amber border and badge
- [x] Changes auto-save to database with status indicator
- [x] "Continue to Writing" navigates to /books/[bookId]/editor
- [x] All 261 tests passing, build clean

## Results

### Files Created (13)
- `src/components/outline/outline-editor.tsx` - DndContext wrapper with sortable chapter list
- `src/components/outline/outline-editor-wrapper.tsx` - Orchestrates header + editor + AI panel
- `src/components/outline/editable-chapter-item.tsx` - Interactive chapter (drag, inline edit, dropdown)
- `src/components/outline/editable-sub-section.tsx` - Inline-editable key points with remove
- `src/components/outline/add-chapter-button.tsx` - Dashed border "Add new chapter" CTA
- `src/hooks/use-outline-editor.ts` - useReducer + debounced auto-save hook
- `src/server/actions/outlines.ts` - Server action with auth, Zod validation
- `src/lib/validations/outlines.ts` - Zod schemas for outline editor
- `src/components/ui/dropdown-menu.tsx` - shadcn DropdownMenu
- 5 test files (46 new tests)

### Files Modified (4)
- `src/components/outline/outline-header.tsx` - Now client component with onAddChapter + navigation
- `src/app/(app)/books/[bookId]/outline/page.tsx` - Uses OutlineEditorWrapper
- `src/components/outline/index.ts` - Added new exports
- `src/server/mutations/outlines.ts` - Accepts per-chapter aiSuggested flag

### Dependencies Added
- @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, @dnd-kit/modifiers
- @testing-library/user-event (dev)

## Postmortem

### What went well
- dnd-kit integrated cleanly with React 19 and the existing component structure
- The useReducer pattern kept state management clean across 7 action types
- Existing saveOutlineSections mutation only needed a minor change (aiSuggested flag)
- All 261 tests passed with zero collateral failures

### What could be improved
- Zod v4 UUID validation is stricter than expected (rejects `00000000-...01` format) — caught in tests, needed proper v4 UUID in test fixtures
- Zod v4 uses `.issues` not `.errors` — build caught this TypeScript error quickly
- `@testing-library/user-event` wasn't installed yet — could add to initial project setup

### Lessons learned
- Zod v4 strict UUID: only nil UUID (`000...000`) and properly versioned UUIDs are valid
- Zod v4 API: use `.issues` instead of `.errors` for accessing validation errors
- dnd-kit's `restrictToVerticalAxis` modifier and `PointerSensor` with distance constraint work well for list reordering

### Metrics
- Tests: 261 passing (46 new), 0 failures
- Build: clean, all routes compiled
- Time: ~25 minutes
