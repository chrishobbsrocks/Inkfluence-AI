---
sprint: 21
title: "Chapter Navigation and UI Polish"
epic: null
status: done
created: 2026-02-13T21:17:03Z
started: 2026-02-13T21:17:03Z
completed: 2026-02-13
hours: 0.3
workflow_version: "3.5.0"


---

# Sprint 21: Chapter Navigation and UI Polish

## Overview

| Field | Value |
|-------|-------|
| Sprint | 21 |
| Title | Chapter Navigation and UI Polish |
| Epic | None (standalone) |
| Status | Planning |
| Created | 2026-02-13 |
| Started | - |
| Completed | - |

## Goal

Add chapter list navigation to the sidebar and previous chapter navigation to the editor, then polish the logo to match the wireframe spec exactly.

## Background

After Sprint 20 bug fixes, the chapter editor has a working "Next Chapter" button but no way to navigate backwards or see all chapters at a glance. The sidebar "Chapters" link just jumps to the editor page without showing which chapters exist. Users need to see all their chapters and move freely between them.

## Requirements

### Critical: Chapter Sidebar Navigator

- [ ] **Sidebar "Chapters" should expand to show all chapters**: When in a book context, the "Chapters" item in `src/components/app-shell/sidebar-nav-book.tsx` should:
  - Show a collapsible/expandable list of all chapters under the "Chapters" nav item
  - Each chapter shows: chapter number, title, and status indicator (outline/writing/draft/complete)
  - Clicking a chapter navigates to `/books/[bookId]/editor?chapter=[chapterId]`
  - Current chapter is visually highlighted (active state)
  - Fetch chapters via `getChaptersByBookId()` from `src/server/queries/chapters.ts`
  - Show empty state if no chapters exist yet ("No chapters - complete your outline first")
  - Use stone color palette, match existing sidebar styling patterns

### Critical: Previous Chapter Navigation

- [ ] **Add "Previous Chapter" button to chapter editor header**: Mirror the existing "Next Chapter" button in `src/components/editor/chapter-editor-header.tsx`:
  - Add `getPreviousChapter()` query function to `src/server/queries/chapters.ts` (similar to existing `getNextChapter()`)
  - Calculate `previousChapterId` in `src/app/(app)/books/[bookId]/editor/page.tsx` (line ~64, alongside existing next chapter calculation)
  - Pass `previousChapterId` to `ChapterEditorWrapper` props
  - Pass through to `ChapterEditorHeader`
  - Render "Previous Chapter" button with ArrowLeft icon on the LEFT side of the header button group
  - Only show when `previousChapterId` is not null (hide on first chapter)
  - Navigate to `/books/[bookId]/editor?chapter=[previousChapterId]` on click

### Polish: Logo Wireframe Match

- [ ] **Logo must match wireframe spec exactly** (lines 37-42 of inkfluence-ai-hifi-wireframes.jsx):
  - Icon container: `w-7 h-7 rounded-lg bg-stone-900` (solid fill, no border/outline)
  - Icon: `BookOpen` from Lucide, `w-3.5 h-3.5 text-white`
  - Text: "Inkfluence" in `font-semibold text-sm text-stone-900` using Instrument Serif font family
  - "AI" after it in `text-stone-400 font-normal`
  - Layout: `flex items-center gap-2`, compact
  - Sprint 20 only fixed the color — verify the full spec matches

## Dependencies

- **Sprints**: Sprint 20 complete (chapter creation from outline working)
- **External**: None

## Scope

### In Scope

- Chapter list in sidebar (expandable under "Chapters" nav item)
- Previous Chapter button in editor header
- Logo wireframe compliance check and fix
- Any sidebar styling adjustments for chapter list

### Out of Scope

- New features (AI, export, etc.)
- Chapter reordering or drag-and-drop
- Mobile responsive sidebar
- Performance optimization

## Technical Approach

### Chapter Sidebar Navigator

The sidebar currently uses `SidebarNavBook` (`src/components/app-shell/sidebar-nav-book.tsx`) which renders static nav items. The "Chapters" item is just a link. Change it to:

1. Make "Chapters" a collapsible section (use shadcn Collapsible or Accordion)
2. Fetch chapters server-side in the book layout or pass as props
3. Render chapter list items as sub-navigation under "Chapters"
4. Highlight active chapter based on current `?chapter=` search param

### Previous Chapter Navigation

Infrastructure already exists:
- `getNextChapter()` in queries already works
- `nextChapterId` is already calculated and passed through the component chain
- Simply mirror this pattern for `previousChapterId`

### Files to Modify

| File | Change |
|------|--------|
| `src/server/queries/chapters.ts` | Add `getPreviousChapter()` function |
| `src/app/(app)/books/[bookId]/editor/page.tsx` | Calculate `previousChapterId` |
| `src/components/editor/chapter-editor-wrapper.tsx` | Add `previousChapterId` prop |
| `src/components/editor/chapter-editor-header.tsx` | Add Previous Chapter button |
| `src/components/app-shell/sidebar-nav-book.tsx` | Add expandable chapter list |
| `src/components/app-shell/app-sidebar.tsx` | Pass chapters data if needed |
| Logo component (location TBD) | Match wireframe spec |

## Tasks

### Team 1 (UI & Navigation)
- [ ] Add `getPreviousChapter()` to chapter queries
- [ ] Calculate previous chapter in editor page.tsx
- [ ] Pass `previousChapterId` through wrapper to header
- [ ] Add Previous Chapter button with ArrowLeft icon
- [ ] Fetch chapters list for sidebar
- [ ] Create expandable chapter sub-navigation in sidebar
- [ ] Highlight active chapter in sidebar list
- [ ] Verify and fix logo to match full wireframe spec
- [ ] Test navigation: first chapter (no prev), last chapter (no next), middle chapters (both)

### Verification
- [ ] Navigate forward and backward through all chapters
- [ ] Sidebar shows all chapters with correct titles and status
- [ ] Active chapter highlighted in sidebar
- [ ] Logo matches wireframe exactly
- [ ] No console errors during navigation
- [ ] Vercel build passes clean

## Acceptance Criteria

- [ ] Sidebar "Chapters" section expands to show all chapter titles
- [ ] Clicking a chapter in sidebar navigates to that chapter in editor
- [ ] Active chapter is visually highlighted in sidebar
- [ ] "Previous Chapter" button appears on all chapters except the first
- [ ] "Next Chapter" button appears on all chapters except the last
- [ ] Navigation between chapters preserves unsaved work (auto-save triggers)
- [ ] Logo matches wireframe spec (icon container, font, colors, layout)
- [ ] Build passes clean on Vercel

## Postmortem

### What went well
- Mirroring the existing getNextChapter/nextChapterId pattern made Previous Chapter trivial
- Upgrading book layout from client to server component fixed the "Untitled Book" bug for free
- Collapsible component from shadcn provided accessible expand/collapse out of the box
- Only 1 collateral test failure (app-sidebar missing useSearchParams mock) — quick fix

### What could be improved
- BookContext now accepts a chapters array which re-renders on every reference change — should memoize in layout
- The chapter list doesn't auto-scroll to the active chapter if there are many chapters

### Key metrics
- Tests: 690 passing (+4 new sidebar tests)
- Build: Clean
- Files changed: 10

## Notes

This is a Dev Team 1 sprint (UI domain). No AI or backend changes needed beyond the simple chapter query function.
