---
sprint: 12
title: "AI Writing Assistant Panel"
type: fullstack
epic: 5
status: done
created: 2026-02-13T13:13:37Z
started: 2026-02-13T17:10:42Z
completed: 2026-02-13T18:00:00Z
hours: 0.8
workflow_version: "3.1.0"

---

# Sprint 12: AI Writing Assistant Panel

## Overview

| Field | Value |
|-------|-------|
| Sprint | 12 |
| Title | AI Writing Assistant Panel |
| Type | fullstack |
| Epic | 5 |
| Status | Done |
| Created | 2026-02-13 |
| Started | 2026-02-13 |
| Completed | 2026-02-13 |

## Goal

Replace the static AI sidebar placeholder with a fully interactive AI Writing Assistant panel featuring tone/expertise controls, chapter progress tracking, section checklist, and AI content block actions (accept/regenerate/discard).

## Background

Sprint 11 built the AI Content Generation Engine with hardcoded "professional"/"intermediate" defaults. Sprint 12 adds the user-facing controls so authors can customize tone, track progress, and manage AI-generated content blocks directly in the editor.

## Requirements

### Functional Requirements

- [x] AI Writing Assistant panel replaces AiSidebarPlaceholder (w-64, bg-stone-50)
- [x] Tone selector with 3 toggle buttons: Professional, Conversational, Academic
- [x] Expertise selector with 3 toggle buttons: Beginner, Intermediate, Expert
- [x] Chapter progress bar with word count vs 3000 target
- [x] Section checklist from outline key points (done/active/pending indicators)
- [x] "Generate Chapter" button at bottom of panel with loading state
- [x] AI content block NodeView with Accept/Regenerate/Discard action buttons
- [x] Tone/expertise selections wired to generation API (no more hardcoded values)
- [x] Key points fetched from outline sections on server page

### Non-Functional Requirements

- [x] Panel controls disabled during generation
- [x] Action buttons visible on hover over AI content blocks
- [x] Progress updates in real-time as word count changes
- [x] 23 new tests passing (9 hook + 14 panel component)

## Dependencies

- **Sprints**: Sprint 10 (Rich Text Editor), Sprint 11 (AI Content Generation Engine)
- **External**: Tiptap ReactNodeViewRenderer

## Scope

### In Scope

- AI Writing Assistant panel with tone/expertise/progress/sections
- AI content block NodeView with action bar (accept/regenerate/discard)
- Server-side key points fetching for section checklist
- Removal of AI Generate button from toolbar (panel is the sole trigger)
- Deletion of AiSidebarPlaceholder

### Out of Scope

- Content-based section detection (uses simple counter)
- Persist panel preferences across sessions
- Section-by-section generation (generates full chapter)

## Technical Approach

### Component Architecture

```
ChapterEditorWrapper
  ├── useChapterEditor (existing)
  ├── useChapterGeneration (existing)
  ├── useAiPanelState (NEW: tone, expertise, sections, progress)
  ├── ChapterEditorLayout
  │   ├── EditorToolbar (AI button removed)
  │   ├── EditorContentArea
  │   │   └── AiContentBlock NodeView (action buttons)
  │   └── AiWritingPanel (NEW: replaces placeholder)
  │       ├── ToneSelector
  │       ├── ExpertiseSelector
  │       ├── ChapterProgress
  │       └── SectionChecklist
```

### State Flow

- Panel state lives in `useAiPanelState` hook (tone, expertise, sections derived from keyPoints + counter)
- Tone/expertise prop-drilled from wrapper → layout → panel (2 levels, no context needed)
- `handleAiGenerate` uses `panelState.tone` and `panelState.expertise` instead of hardcoded values
- NodeView accesses regenerate callback via `editor.storage.aiContentBlock.onRegenerate`

### AI Content Block Actions

- **Accept**: `editor.commands.unsetAiContentBlock()` (lifts content, removes amber border)
- **Regenerate**: Calls stored `onRegenerate` callback via extension storage
- **Discard**: `deleteNode()` from NodeView props (removes entire block)

## Tasks

### Phase 1: Planning
- [x] Review requirements and wireframes
- [x] Design architecture with Plan agent
- [x] Clarify requirements (toolbar removal, NodeView, counter tracking, delete placeholder)

### Phase 2: Implementation
- [x] Create `useAiPanelState` hook
- [x] Create sub-components (ToneSelector, ExpertiseSelector, ChapterProgress, SectionChecklist)
- [x] Create `AiWritingPanel` container component
- [x] Create `AiContentBlockView` React NodeView component
- [x] Update `AiContentBlock` extension with NodeView renderer and storage
- [x] Update `ChapterEditorLayout` to use AiWritingPanel
- [x] Update `ChapterEditorWrapper` with useAiPanelState and wired generation
- [x] Update `EditorToolbar` (remove AI Generate button)
- [x] Update editor page (fetch outline key points)
- [x] Update exports, delete placeholder
- [x] Fix ResizeObserver mock (class instead of arrow function)
- [x] Write tests (23 tests across 2 test files)

### Phase 3: Validation
- [x] All 475 tests passing (0 failures)
- [x] Quality review complete

### Phase 4: Documentation
- [x] Sprint file updated

## Acceptance Criteria

- [x] All 475 tests passing (`pnpm test`)
- [x] AI Writing Assistant panel renders with tone/expertise controls
- [x] Tone/expertise selections flow into generation API call
- [x] Chapter progress bar shows word count vs 3000 target
- [x] Section checklist shows done/active/pending from key points
- [x] AI content blocks show Accept/Regenerate/Discard on hover
- [x] AI Generate button removed from toolbar (panel is sole trigger)
- [x] AiSidebarPlaceholder deleted

## Files Changed

### New Files (9)
- `src/hooks/use-ai-panel-state.ts` — Panel state hook (tone, expertise, sections, progress)
- `src/components/editor/ai-writing-panel.tsx` — Main panel container
- `src/components/editor/ai-panel/tone-selector.tsx` — Tone toggle buttons
- `src/components/editor/ai-panel/expertise-selector.tsx` — Expertise toggle buttons
- `src/components/editor/ai-panel/chapter-progress.tsx` — Progress bar with word count
- `src/components/editor/ai-panel/section-checklist.tsx` — Section items with status icons
- `src/components/editor/extensions/ai-content-block-view.tsx` — React NodeView with action bar
- `src/hooks/__tests__/use-ai-panel-state.test.ts` — 9 hook tests
- `src/components/editor/__tests__/ai-writing-panel.test.tsx` — 14 panel tests

### Modified Files (6)
- `src/components/editor/chapter-editor-layout.tsx` — Replace placeholder with AiWritingPanel
- `src/components/editor/chapter-editor-wrapper.tsx` — Add useAiPanelState, wire tone/expertise
- `src/components/editor/editor-toolbar.tsx` — Remove AI Generate button and props
- `src/components/editor/extensions/ai-content-block.ts` — Add NodeView, addStorage
- `src/app/(app)/books/[bookId]/editor/page.tsx` — Fetch outline key points
- `src/components/editor/index.ts` — Update exports
- `src/tests/setup.ts` — Fix ResizeObserver mock to use class

### Deleted Files (1)
- `src/components/editor/ai-sidebar-placeholder.tsx` — Replaced by AiWritingPanel

## Postmortem

See [Sprint 12 Postmortem](./sprint-12_postmortem.md)
