---
sprint: 10
title: "Rich Text Editor Setup"
type: fullstack
epic: 5
status: done
created: 2026-02-13T13:13:35Z
started: 2026-02-13T16:16:20Z
completed: 2026-02-13
hours: 0.2
workflow_version: "3.1.0"


---

# Sprint 10: Rich Text Editor Setup

## Overview

| Field | Value |
|-------|-------|
| Sprint | 10 |
| Title | Rich Text Editor Setup |
| Type | fullstack |
| Epic | 5 |
| Status | Done |
| Created | 2026-02-13 |
| Started | 2026-02-13 |
| Completed | 2026-02-13 |

## Goal

Set up the Tiptap rich text editor with formatting toolbar, auto-save, chapter navigation, and the chapter editor page layout.

## Background

The chapter editor is where users write and refine their book content. It uses Tiptap (built on ProseMirror) with a formatting toolbar, content area, and an AI assistant panel placeholder. This sprint builds the editor foundation — AI integration comes in Sprints 11-12.

## Requirements

### Functional Requirements

- [x] Tiptap editor with ProseMirror foundation
- [x] Formatting toolbar: Bold, Italic, Underline, H1, H2, Quote, Bullet List, Ordered List, Image placeholder
- [x] Chapter title as editable heading (Instrument Serif font)
- [x] Content area with proper typography (13px, text-stone-600, leading-relaxed)
- [x] Auto-save with "Auto-saved Xs ago" indicator in header
- [x] Chapter navigation ("Next Chapter" button via URL search params)
- [x] Preview button in header
- [x] Chapter content persists to database
- [x] Load chapter content from database on page load
- [x] Empty state when no chapters exist

### Non-Functional Requirements

- [x] Auto-save debounced (2 seconds after last keystroke)
- [x] Undo/redo support (via StarterKit History extension)
- [x] Keyboard shortcuts for formatting (Cmd+B, Cmd+I, etc.)

## Dependencies

- **Sprints**: Sprint 8 (outline provides chapter structure), Sprint 4 (book data model)
- **External**: @tiptap/react, @tiptap/pm, @tiptap/starter-kit, @tiptap/extension-underline, @tiptap/extension-image, @tiptap/extension-placeholder

## Scope

### In Scope

- Tiptap editor integration with formatting toolbar
- Auto-save to database with 2s debounce
- Chapter editor page layout (editor pane + right sidebar placeholder)
- Chapter content persistence (queries, mutations, server actions)
- Chapter navigation via URL search params
- Empty state for books without chapters
- Toolbar tooltips with keyboard shortcuts

### Out of Scope

- AI content generation (Sprint 11)
- AI writing assistant panel (Sprint 12)
- Image upload

## Technical Approach

Used Tiptap with StarterKit (provides bold, italic, heading, blockquote, lists, history/undo-redo, keyboard shortcuts out of the box) plus extensions for underline, image, and placeholder text. Created a useChapterEditor hook following the same useReducer + debounced auto-save pattern from Sprint 8's useOutlineEditor. The editor page is a server component that loads chapters and passes data to a ChapterEditorWrapper client component. Chapter selection uses URL search params (?chapter=id) for clean server-side data loading.

## Tasks

### Phase 1: Planning
- [x] Review requirements
- [x] Design architecture (Plan agent)
- [x] Clarify requirements (URL params, empty state, tooltips)

### Phase 2: Implementation
- [x] Install Tiptap packages and shadcn tooltip/separator
- [x] Create Zod validation schemas (chapters)
- [x] Create chapter queries (getChapterById, getChaptersByBookId, getNextChapter)
- [x] Create chapter mutations (updateChapterContent)
- [x] Create server action (updateChapterContentAction)
- [x] Create word count utility
- [x] Create useChapterEditor hook (reducer + 2s debounced auto-save)
- [x] Create AiSidebarPlaceholder component
- [x] Create EditorToolbar component (9 formatting buttons with tooltips)
- [x] Create ChapterTitleInput component
- [x] Create EditorContentArea component (Tiptap wrapper)
- [x] Create ChapterEditorHeader component (auto-save display + nav)
- [x] Create ChapterEditorLayout component (two-pane layout)
- [x] Create ChapterEditorWrapper component (Tiptap orchestrator)
- [x] Update editor page (server component with chapter loading)

### Phase 3: Validation
- [x] Write validation tests (10 tests)
- [x] Write mutation tests (2 tests)
- [x] Write server action tests (6 tests)
- [x] Write reducer tests (7 tests)
- [x] Write toolbar component tests (7 tests)
- [x] Write word count tests (7 tests)
- [x] Run full test suite (300 passing, 0 failures)

### Phase 4: Commit
- [x] Git commit

## Acceptance Criteria

- [x] Tiptap editor renders and accepts input
- [x] Formatting toolbar works: bold, italic, underline, H1, H2, quote, bullet list, ordered list
- [x] Keyboard shortcuts work (Cmd+B, Cmd+I, etc. via StarterKit)
- [x] Content auto-saves 2 seconds after last keystroke
- [x] "Auto-saved Xs ago" shows in header
- [x] Chapter content persists via server action
- [x] Chapter navigation via Next Chapter button + URL search params
- [x] Empty state when no chapters exist with link to outline
- [x] All 300 tests passing, build clean

## Results

### Files Created (18)
- `src/components/editor/chapter-editor-wrapper.tsx` - Tiptap orchestrator with useEditor
- `src/components/editor/chapter-editor-header.tsx` - Header with auto-save indicator + navigation
- `src/components/editor/chapter-editor-layout.tsx` - Two-pane layout (editor + sidebar)
- `src/components/editor/editor-toolbar.tsx` - 9 formatting buttons with tooltips
- `src/components/editor/chapter-title-input.tsx` - Editable title with Instrument Serif
- `src/components/editor/editor-content-area.tsx` - Tiptap EditorContent wrapper
- `src/components/editor/ai-sidebar-placeholder.tsx` - Sprint 12 placeholder
- `src/components/editor/index.ts` - Barrel exports
- `src/hooks/use-chapter-editor.ts` - useReducer + 2s debounced auto-save
- `src/lib/validations/chapters.ts` - Zod schemas
- `src/lib/word-count.ts` - HTML word counter
- `src/server/queries/chapters.ts` - Chapter read operations
- `src/server/mutations/chapters.ts` - Chapter write operations
- `src/server/actions/chapters.ts` - Server action with auth + Zod
- 6 test files (39 new tests)

### Files Modified (1)
- `src/app/(app)/books/[bookId]/editor/page.tsx` - Full server component with chapter loading

### Dependencies Added
- @tiptap/react, @tiptap/pm, @tiptap/starter-kit
- @tiptap/extension-underline, @tiptap/extension-image, @tiptap/extension-placeholder

## Postmortem

### What went well
- Tiptap installed cleanly with all 6 packages and integrated with React 19 without issues
- The useChapterEditor hook reused the exact pattern from useOutlineEditor (reducer + debounced effect), making implementation very fast
- All existing patterns (server actions, Zod validation, MutationResult) carried over directly to the chapter data layer
- Zero collateral test failures across all 300 tests

### What could be improved
- The chapter data layer (queries/mutations/actions) could share the requireUser helper and ActionResult type via a shared module instead of duplicating in each action file
- Toolbar active states depend on re-renders triggered by editor updates; could be optimized if performance becomes an issue

### Lessons learned
- Tiptap's StarterKit bundles an impressive amount of functionality (bold, italic, heading, blockquote, lists, history, keyboard shortcuts) — minimal additional extensions needed
- URL search params for chapter navigation works cleanly with Next.js server components — no need for complex client-side routing
- The word count utility needs to strip HTML tags before counting; Tiptap's `editor.getText()` provides clean text directly

### Metrics
- Tests: 300 passing (39 new), 0 failures
- Build: clean, all routes compiled
- Time: ~12 minutes
