# Sprint 10: Rich Text Editor Setup

## Overview

| Field | Value |
|-------|-------|
| Sprint | 10 |
| Title | Rich Text Editor Setup |
| Epic | 5 - Content Generation and Chapter Editor |
| Status | Planning |
| Created | 2026-02-13 |
| Started | - |
| Completed | - |

## Goal

Set up the Tiptap rich text editor with formatting toolbar, auto-save, and the chapter editor page layout.

## Background

The chapter editor is where users write and refine their book content. It uses a rich text editor (Tiptap, built on ProseMirror) with a formatting toolbar, content area, and an AI assistant panel on the right. This sprint focuses on the editor itself — AI integration comes in Sprints 11-12.

## Requirements

### Functional Requirements

- [ ] Tiptap editor with ProseMirror foundation
- [ ] Formatting toolbar: Bold, Italic, Underline, H1, H2, Quote, List, Image placeholder
- [ ] Chapter title as editable heading (Instrument Serif font)
- [ ] Content area with proper typography (13px, text-stone-600, leading-relaxed)
- [ ] Auto-save with "Auto-saved Xs ago" indicator in header
- [ ] Chapter navigation ("Next Chapter →" button)
- [ ] Preview button in header
- [ ] Chapter content persists to database
- [ ] Load chapter content from database on page load

### Non-Functional Requirements

- [ ] Editor performs smoothly with 5000+ words
- [ ] Auto-save debounced (2 seconds after last keystroke)
- [ ] Undo/redo support
- [ ] Keyboard shortcuts for formatting (Cmd+B, Cmd+I, etc.)

## Dependencies

- **Sprints**: Sprint 8 (outline provides chapter structure), Sprint 4 (chapter data model)
- **External**: @tiptap/react, @tiptap/starter-kit, @tiptap/extension-*

## Scope

### In Scope

- Tiptap editor integration
- Formatting toolbar
- Auto-save to database
- Chapter editor page layout (editor pane + right sidebar placeholder)
- Chapter content persistence
- Basic typography matching wireframe

### Out of Scope

- AI content generation (Sprint 11)
- AI writing assistant panel (Sprint 12)
- Image upload (defer)

## Technical Approach

### Reference: Wireframe EditorScreen (lines 368-472)

### Tiptap Extensions
```
@tiptap/starter-kit (Document, Paragraph, Text, Bold, Italic, Heading, etc.)
@tiptap/extension-underline
@tiptap/extension-placeholder
@tiptap/extension-character-count
```

### Layout
- Left pane (flex-1): Toolbar + Editor
- Right pane (w-64): AI panel placeholder (built in Sprint 12)
- Toolbar: bg-stone-50, border-b, icon buttons

### Auto-save
- Debounce editor changes (2s)
- Save via server action (updateChapterContent)
- Show "Auto-saved Xs ago" in header

## Tasks

### Phase 2: Implementation
- [ ] Install Tiptap and required extensions
- [ ] Create TiptapEditor component with extensions configured
- [ ] Create EditorToolbar component (formatting buttons per wireframe)
- [ ] Create chapter editor page at /books/[bookId]/editor
- [ ] Implement chapter selection/navigation
- [ ] Implement auto-save with debounce
- [ ] Create auto-save indicator ("Auto-saved Xs ago")
- [ ] Style editor content area to match wireframe typography
- [ ] Load chapter content from database
- [ ] Create right sidebar placeholder (will be populated in Sprint 12)

## Acceptance Criteria

- [ ] Tiptap editor renders and accepts input
- [ ] Formatting toolbar works: bold, italic, underline, H1, H2, quote, list
- [ ] Keyboard shortcuts work (Cmd+B, Cmd+I, etc.)
- [ ] Content auto-saves 2 seconds after last keystroke
- [ ] "Auto-saved Xs ago" shows in header
- [ ] Chapter content persists across page refreshes
- [ ] Editor handles 5000+ words without lag
- [ ] Chapter navigation works (Next Chapter button)
- [ ] Editor styling matches wireframe (lines 380-423)

## Notes

Wireframe reference: EditorScreen lines 368-472. Focus on left pane (editor) only — right pane (AI panel) is Sprint 12.
