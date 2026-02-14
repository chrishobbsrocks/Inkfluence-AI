# Sprint 14: Export Engine PDF EPUB

## Overview

| Field | Value |
|-------|-------|
| Sprint | 14 |
| Title | Export Engine PDF EPUB |
| Epic | 6 - Preview Format and Export |
| Status | Planning |
| Created | 2026-02-13 |
| Started | - |
| Completed | - |

## Goal

Build the export engines that generate publication-ready PDF, EPUB, and MOBI files from book content with template styling applied.

## Background

Users need to download their book in standard publishing formats. PDF for direct distribution, EPUB for Apple Books and most e-readers, MOBI for Kindle. Each format has specific requirements for formatting, metadata, and structure.

## Requirements

### Functional Requirements

- [ ] PDF export with template styling (fonts, margins, layout)
- [ ] EPUB export compliant with EPUB 3 standard
- [ ] MOBI export for Kindle (via EPUB conversion)
- [ ] Cover image embedded in all formats
- [ ] Table of contents in all formats
- [ ] Chapter headings properly formatted
- [ ] Metadata embedded (title, author, description)
- [ ] Download buttons trigger file generation and download
- [ ] Progress indicator during generation

### Non-Functional Requirements

- [ ] PDF generation under 30 seconds for 8-chapter book
- [ ] EPUB validates against EPUB Check
- [ ] Files under 10MB for standard text-only book
- [ ] Generation runs server-side (not in browser)

## Dependencies

- **Sprints**: Sprint 13 (template system), Sprint 4 (book/chapter data)
- **External**: PDF and EPUB generation libraries

## Scope

### In Scope

- PDF generation with template styling
- EPUB generation
- MOBI generation (via Calibre or epub-to-mobi conversion)
- Cover image integration
- TOC generation
- Metadata embedding
- Download API route

### Out of Scope

- Print-ready PDF (bleed, trim marks)
- Custom DRM
- Interactive EPUB features

## Technical Approach

### Libraries
- PDF: `@react-pdf/renderer` (React-based PDF generation) or `puppeteer` (HTML→PDF)
- EPUB: `epub-gen-memory` (generates EPUB from HTML content)
- MOBI: Convert EPUB to MOBI via server-side tool (or defer MOBI)

### API Routes
- POST /api/export/pdf — Generate PDF, return download URL
- POST /api/export/epub — Generate EPUB, return download URL
- POST /api/export/mobi — Generate MOBI, return download URL

### PDF Generation Flow
1. Fetch all chapter content
2. Apply template styling (fonts, margins, colors)
3. Render to PDF with proper page breaks between chapters
4. Embed cover image and metadata
5. Store temporarily in Vercel Blob
6. Return download URL

### EPUB Generation Flow
1. Fetch all chapters as HTML
2. Structure as EPUB (content.opf, toc.ncx, chapters as XHTML)
3. Apply CSS from template
4. Pack as .epub
5. Return download URL

## Tasks

### Phase 2: Implementation
- [ ] Install PDF generation library
- [ ] Install EPUB generation library
- [ ] Create PDF renderer that applies template styling
- [ ] Create EPUB builder with proper structure
- [ ] Build POST /api/export/pdf route
- [ ] Build POST /api/export/epub route
- [ ] Implement cover image embedding
- [ ] Implement TOC generation for both formats
- [ ] Implement metadata embedding
- [ ] Create download progress indicator
- [ ] Store generated files in Vercel Blob
- [ ] Add download buttons to preview page (wire up)
- [ ] Test output files in PDF reader and EPUB reader

## Acceptance Criteria

- [ ] PDF downloads with correct template styling
- [ ] EPUB downloads and opens in e-reader
- [ ] Cover image appears in both formats
- [ ] Table of contents navigable in both formats
- [ ] Metadata (title, author) embedded in file properties
- [ ] Chapter headings properly formatted
- [ ] Generation completes under 30 seconds
- [ ] Download triggers automatically after generation
- [ ] Error states handled (empty book, generation failure)

## Notes

MOBI can be deferred if Calibre server-side conversion is complex. Most modern Kindles support EPUB now.
Consider using Puppeteer for PDF (HTML→PDF) as it gives most control over layout.
