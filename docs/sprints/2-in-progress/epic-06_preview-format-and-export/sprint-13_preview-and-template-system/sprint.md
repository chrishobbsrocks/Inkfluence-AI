# Sprint 13: Preview and Template System

## Overview

| Field | Value |
|-------|-------|
| Sprint | 13 |
| Title | Preview and Template System |
| Epic | 6 - Preview Format and Export |
| Status | Planning |
| Created | 2026-02-13 |
| Started | - |
| Completed | - |

## Goal

Build the book preview renderer, template system with 4 design templates, cover design placeholder, and formatting controls.

## Background

Before exporting, users need to see how their book will look. The preview screen shows a rendered book page with selectable templates, cover design, and formatting options. This gives users confidence in the final product before they export or publish.

## Requirements

### Functional Requirements

- [ ] Book preview area showing formatted content as a "page"
- [ ] Tab navigation: Book Preview, Cover Design, Table of Contents
- [ ] 4 templates: Modern, Classic, Minimal, Bold (selectable grid)
- [ ] Selected template highlighted with border-stone-900
- [ ] Cover design section with "Generate AI Cover" button (placeholder)
- [ ] Table of contents auto-generated from chapters
- [ ] Formatting options: Font selection, Size, Margins
- [ ] Export buttons in header: PDF, EPUB
- [ ] "Proceed to Publish →" button

### Non-Functional Requirements

- [ ] Preview renders in under 2 seconds
- [ ] Templates visually distinct from each other
- [ ] Preview accurately represents export output

## Dependencies

- **Sprints**: Sprint 10 (editor content to preview), Sprint 8 (outline for TOC)
- **External**: None

## Scope

### In Scope

- Preview page at /books/[bookId]/preview
- Book page renderer component
- Template definitions (4 templates)
- Template selector UI
- Formatting controls panel
- Table of contents generation
- Cover design placeholder

### Out of Scope

- Actual PDF/EPUB export (Sprint 14)
- AI cover generation (placeholder only)
- Custom template creation

## Technical Approach

### Reference: Wireframe PreviewScreen (lines 476-553)

### Template System
Each template defines:
```typescript
interface BookTemplate {
  id: string;
  name: string;
  fonts: { heading: string; body: string };
  fontSize: number;
  margins: { top: number; right: number; bottom: number; left: number };
  colors: { heading: string; body: string; accent: string };
  spacing: { paragraph: number; heading: number };
}
```

4 templates: Modern (clean sans-serif), Classic (serif, traditional), Minimal (lots of whitespace), Bold (large headings, strong contrast)

### Preview Renderer
- Takes chapter content (from Tiptap HTML) + template config
- Renders a paginated view showing how the book will look
- Center-aligned in a bg-stone-200/50 container

## Tasks

### Phase 2: Implementation
- [ ] Create preview page at /books/[bookId]/preview
- [ ] Create BookPreviewRenderer component (renders content with template styling)
- [ ] Define 4 template configurations (Modern, Classic, Minimal, Bold)
- [ ] Create TemplateSelector component (2x2 grid with selection state)
- [ ] Create FormatOptionsPanel component (font, size, margins)
- [ ] Create TabNav component (Book Preview, Cover Design, TOC)
- [ ] Build table of contents generator from chapter data
- [ ] Create CoverDesign placeholder component
- [ ] Wire up template selection to preview renderer
- [ ] Add export buttons and "Proceed to Publish" navigation

## Acceptance Criteria

- [ ] Preview shows book content formatted with selected template
- [ ] 4 templates selectable with visual distinction
- [ ] Table of contents generates from chapter titles
- [ ] Cover design section visible with placeholder
- [ ] Font, size, and margin controls work
- [ ] Preview updates when template changes
- [ ] "Proceed to Publish" navigates to publishing hub
- [ ] UI matches wireframe PreviewScreen (lines 476-553)

## Notes

Wireframe reference: PreviewScreen lines 476-553.
The book page preview uses Instrument Serif for title and DM Sans for body text in the "Modern" template.
