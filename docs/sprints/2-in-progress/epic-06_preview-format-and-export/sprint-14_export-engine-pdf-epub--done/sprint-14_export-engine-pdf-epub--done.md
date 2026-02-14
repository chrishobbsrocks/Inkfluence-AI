---
sprint: 14
title: "Export Engine PDF EPUB"
type: fullstack
epic: 6
status: done
created: 2026-02-13T13:13:39Z
started: 2026-02-13T17:03:10Z
completed: 2026-02-13
hours: 0.3
workflow_version: "3.1.0"


---

# Sprint 14: Export Engine PDF EPUB

## Overview

| Field | Value |
|-------|-------|
| Sprint | 14 |
| Title | Export Engine PDF EPUB |
| Type | fullstack |
| Epic | 6 |
| Status | Done |
| Created | 2026-02-13 |
| Started | 2026-02-13 |
| Completed | 2026-02-13 |

## Goal

Build export engines that generate publication-ready PDF and EPUB files from book content with template styling applied.

## Background

Users need to download their book in standard publishing formats. PDF for direct distribution, EPUB for Apple Books and most e-readers. Each format has specific requirements for formatting, metadata, and structure.

## Requirements

### Functional Requirements

- [x] PDF export with template styling (fonts, margins, layout)
- [x] EPUB export with CSS derived from template configuration
- [x] Table of contents in both formats
- [x] Chapter headings properly formatted
- [x] Metadata embedded (title, author)
- [x] Download buttons trigger file generation and download
- [x] Loading spinner during generation
- [x] MOBI button deferred (disabled with tooltip)

### Non-Functional Requirements

- [x] Generation runs server-side via API routes
- [x] Direct stream response (no blob storage needed)
- [x] Built-in PDF fonts (no network font downloads)
- [x] 34 new tests + updated component tests

## Dependencies

- **Sprints**: Sprint 13 (template system), Sprint 10 (chapter content)
- **External**: @react-pdf/renderer, epub-gen-memory, node-html-parser

## Scope

### In Scope

- PDF generation with @react-pdf/renderer
- EPUB generation with epub-gen-memory
- HTML-to-PDF converter for Tiptap content
- API routes (POST /api/export/pdf, POST /api/export/epub)
- Font mapping (CSS variables -> PDF built-in fonts)
- Template-to-CSS converter for EPUB
- Client-side export hook with loading/error states
- Export buttons wired up in preview header and sidebar

### Out of Scope

- MOBI export (deferred — no viable JS library for Vercel serverless)
- Print-ready PDF (bleed, trim marks)
- Custom DRM
- Vercel Blob storage
- Cover image embedding (no covers generated yet)

## Technical Approach

- **PDF**: @react-pdf/renderer (pure JS, works in serverless). Maps template config to StyleSheet. Custom HTML-to-react-pdf converter handles Tiptap HTML subset.
- **EPUB**: epub-gen-memory (in-memory, returns Buffer). Template config converted to CSS string for chapter styling.
- **Fonts**: Built-in PDF fonts (Helvetica ≈ DM Sans, Times-Roman ≈ Instrument Serif) to avoid network font downloads in serverless.
- **Delivery**: Direct stream response — generate in memory, return as binary response with proper Content-Type and Content-Disposition headers.
- **Client**: useExport hook manages fetch lifecycle, creates Blob, triggers download via temporary anchor element.

## Tasks

### Phase 1: Planning
- [x] Read sprint spec and wireframe
- [x] Design architecture (library selection, API routes, font mapping)
- [x] Clarify requirements (MOBI deferred, direct stream, loading spinner)

### Phase 2: Backend Implementation
- [x] Install @react-pdf/renderer, epub-gen-memory, node-html-parser
- [x] Create export types (ExportBookData, ExportChapter, ExportFormat)
- [x] Create font-map.ts (CSS vars -> PDF/EPUB font families)
- [x] Create template-to-pdf-styles.ts (BookTemplate -> StyleSheet)
- [x] Create html-to-pdf-elements.tsx (Tiptap HTML -> react-pdf elements)
- [x] Create template-to-epub-css.ts (BookTemplate -> CSS string)
- [x] Create pdf-renderer.tsx (title page, TOC, chapter pages)
- [x] Create epub-builder.ts (epub-gen-memory wrapper)
- [x] Create export validation schema (Zod)
- [x] Create POST /api/export/pdf route
- [x] Create POST /api/export/epub route

### Phase 3: Frontend Implementation
- [x] Create useExport hook (fetch, blob download, error handling)
- [x] Update PreviewWrapper to integrate export hook
- [x] Update PreviewHeader (enable PDF/EPUB buttons, loading spinner)
- [x] Update FormatOptionsPanel (enable sidebar export buttons, loading spinner)

### Phase 4: Tests
- [x] Font map tests (7 tests)
- [x] Template styles tests (6 tests)
- [x] EPUB CSS tests (7 tests)
- [x] Validation tests (5 tests)
- [x] HTML-to-PDF tests (9 tests)
- [x] Updated format-options-panel tests (6 tests with new props)
- [x] Updated preview-wrapper tests (8 tests)

### Phase 5: Commit
- [x] Git commit

## Acceptance Criteria

- [x] PDF download generates with correct template styling
- [x] EPUB download generates with template CSS
- [x] Table of contents in both formats
- [x] Chapter headings properly formatted
- [x] Metadata (title, author) embedded
- [x] Download triggers automatically after generation
- [x] Error states handled (empty book, generation failure)
- [x] Loading spinner shown during generation
- [x] MOBI button disabled with "coming soon" tooltip

## Files Created

- `src/lib/export/types.ts` — ExportBookData, ExportChapter, ExportFormat types
- `src/lib/export/font-map.ts` — CSS variable -> PDF/EPUB font mapping
- `src/lib/export/template-to-pdf-styles.ts` — BookTemplate -> @react-pdf/renderer StyleSheet
- `src/lib/export/html-to-pdf-elements.tsx` — Tiptap HTML -> react-pdf element converter
- `src/lib/export/template-to-epub-css.ts` — BookTemplate -> EPUB CSS string
- `src/lib/export/pdf-renderer.tsx` — PDF document builder (title, TOC, chapters)
- `src/lib/export/epub-builder.ts` — EPUB generation wrapper
- `src/lib/validations/export.ts` — Zod schema for export requests
- `src/app/api/export/pdf/route.ts` — PDF export API route
- `src/app/api/export/epub/route.ts` — EPUB export API route
- `src/hooks/use-export.ts` — Client-side export hook
- 5 test files with 34 tests

## Files Modified

- `src/components/preview/preview-wrapper.tsx` — Integrated useExport hook
- `src/components/preview/preview-header.tsx` — Enabled PDF/EPUB buttons with loading spinners
- `src/components/preview/format-options-panel.tsx` — Enabled sidebar export buttons with loading spinners
- `src/components/preview/__tests__/format-options-panel.test.tsx` — Added new required props
- `src/components/preview/__tests__/preview-wrapper.test.tsx` — Fixed missing `vi` import
- `package.json` / `pnpm-lock.yaml` — Added 3 dependencies

## Postmortem

### What went well
- Clean separation of concerns: export engine (lib/export), API routes, client hook
- epub-gen-memory API is simple and works well for our use case
- HTML-to-PDF converter handles the limited Tiptap HTML subset cleanly
- Using built-in PDF fonts avoids network dependency in serverless
- All 34 new tests passed on first run
- TypeScript strict mode caught several issues early (Buffer vs Uint8Array, Node type mismatches)

### What could improve
- epub-gen-memory lacks TypeScript declarations — needed dynamic import with type casting
- node-html-parser Node type doesn't expose tagName/getAttribute directly on base Node
- Cover image embedding is deferred (no covers exist yet)

### Lessons learned
- Buffer is not a valid `BodyInit` for `new Response()` in modern TS — must wrap in `Uint8Array`
- node-html-parser's `Node` type is minimal; need helper functions to safely access HTMLElement properties
- Direct stream response is the right approach for Vercel serverless (no Blob storage complexity needed)

### Metrics
- Tests: 34 new (all passing)
- Files: 12 created, 6 modified
- Lines: +1,961 / -21
- Dependencies: +3 (@react-pdf/renderer, epub-gen-memory, node-html-parser)
