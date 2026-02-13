# Sprint 8: Outline Editor UI

## Overview

| Field | Value |
|-------|-------|
| Sprint | 8 |
| Title | Outline Editor UI |
| Epic | 4 - Outline Editor |
| Status | Planning |
| Created | 2026-02-13 |
| Started | - |
| Completed | - |

## Goal

Build the Outline Editor screen where users can view, reorder, and modify their book's chapter structure with drag-and-drop functionality.

## Background

After the Knowledge Wizard generates an outline, users need to refine it. This editor lets them drag-and-drop chapters, add/remove sections, edit titles, and see word count estimates. The outline is the bridge between the AI interview and actual content generation.

## Requirements

### Functional Requirements

- [ ] Chapter list view with chapter numbers (01, 02, etc.)
- [ ] Chapter title and estimated word count display
- [ ] Sub-sections listed under each chapter with border-l indicator
- [ ] Drag-and-drop reordering of chapters (using GripVertical handle)
- [ ] Add new chapter (plus button at bottom)
- [ ] Remove chapter (via more options menu)
- [ ] Edit chapter title inline
- [ ] Add/remove sub-sections within chapters
- [ ] AI-suggested chapters highlighted with amber styling
- [ ] "AI Suggestions" button in header
- [ ] "Add Chapter" button in header
- [ ] "Continue to Writing" button in header
- [ ] Book title in header ("Outline — The Growth Playbook")

### Non-Functional Requirements

- [ ] Smooth drag-and-drop animations
- [ ] Auto-save outline changes
- [ ] Chapter numbers auto-update after reorder

## Dependencies

- **Sprints**: Sprint 7 (generates the outline data)
- **External**: dnd-kit or @hello-pangea/dnd for drag-and-drop

## Scope

### In Scope

- Outline editor page at /books/[bookId]/outline
- Chapter list with drag-and-drop
- Sub-section management
- Add/remove/edit chapters
- AI-suggested chapter indicators
- Auto-save

### Out of Scope

- AI recommendations panel (Sprint 9)
- Content generation (Sprint 11)

## Technical Approach

### Reference: Wireframe OutlineScreen (lines 279-364)

Layout: grid with 2 columns — outline tree (1fr) and AI panel (280px)
Sprint 8 builds the outline tree. Sprint 9 builds the AI panel.

### Drag and Drop
Use @hello-pangea/dnd (maintained fork of react-beautiful-dnd) or dnd-kit.
Each chapter is a draggable item. Reorder updates order_index in database.

### Data Flow
- Fetch outline sections from database (via outline → outline_sections)
- Local state for drag operations
- Auto-save debounced (500ms) after any change
- Server action to persist changes

## Tasks

### Phase 2: Implementation
- [ ] Install drag-and-drop library
- [ ] Create ChapterItem component (number, title, word count, grip handle, more menu)
- [ ] Create SubSection component (border-l indicator)
- [ ] Create AddChapter component (dashed border CTA)
- [ ] Create OutlineEditor page component
- [ ] Implement drag-and-drop reordering
- [ ] Implement add/remove chapter
- [ ] Implement inline chapter title editing
- [ ] Implement add/remove sub-sections
- [ ] Implement auto-save with debounce
- [ ] Style AI-suggested chapters with amber/amber-50 theme
- [ ] Wire up header buttons

## Acceptance Criteria

- [ ] Chapters display with numbers, titles, word estimates, sub-sections
- [ ] Drag-and-drop reorders chapters and updates numbers
- [ ] Can add new chapters at end of list
- [ ] Can remove chapters via context menu
- [ ] Can edit chapter titles inline
- [ ] AI-suggested chapters show amber border and badge
- [ ] Changes auto-save to database
- [ ] "Continue to Writing" navigates to chapter editor
- [ ] UI matches wireframe outline tree (lines 297-329)

## Notes

Wireframe reference: OutlineScreen lines 279-364. Focus on the left column (outline tree) only — the right column (AI Recommendations) is Sprint 9.
