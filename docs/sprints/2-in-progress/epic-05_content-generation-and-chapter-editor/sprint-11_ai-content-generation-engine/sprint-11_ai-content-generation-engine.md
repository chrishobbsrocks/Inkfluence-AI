---
sprint: 11
title: "AI Content Generation Engine"
type: fullstack
epic: 5
status: done
created: 2026-02-13T13:13:36Z
started: 2026-02-13T16:43:57Z
completed: 2026-02-13T17:15:00Z
hours: 0.5
workflow_version: "3.1.0"

---

# Sprint 11: AI Content Generation Engine

## Overview

| Field | Value |
|-------|-------|
| Sprint | 11 |
| Title | AI Content Generation Engine |
| Type | fullstack |
| Epic | 5 |
| Status | Done |
| Created | 2026-02-13 |
| Started | 2026-02-13 |
| Completed | 2026-02-13 |

## Goal

Build the AI-powered chapter content generation engine with SSE streaming, context-aware prompts, and editor integration so authors can generate full chapter drafts from their outline.

## Background

After Sprint 9 (AI Outline Analysis), the platform can help authors build structured outlines. The next step is enabling authors to generate full chapter content from those outlines. This sprint builds the content generation pipeline: from API route through Claude streaming to live insertion into the Tiptap editor, providing authors with a one-click "AI Generate" experience that produces contextually aware, well-structured chapter drafts.

## Requirements

### Functional Requirements

- [x] POST `/api/ai/generate/chapter` endpoint with Clerk auth and Zod validation
- [x] SSE streaming from Claude API to client via `ReadableStream`
- [x] Context-aware prompts using book topic, audience, key points, and previous chapter summaries
- [x] Throttled (~100ms) content streaming into Tiptap editor
- [x] AI-generated content visually distinguished with amber border (AiContentBlock extension)
- [x] "AI Generate" toolbar button with loading state indicator
- [x] Non-blocking auto-save of generated content after stream completes
- [x] Abort support for cancelling in-progress generation

### Non-Functional Requirements

- [x] Streaming throttled to ~100ms via requestAnimationFrame for smooth UI
- [x] Previous chapter context limited to first 200 chars per chapter
- [x] Conversation context limited to last 6 exchanges (max 500 chars)
- [x] All inputs validated with Zod schemas (UUID format for IDs)
- [x] 35 new tests passing across prompts, validation, hook, and component layers

## Dependencies

- **Sprints**: Sprint 8 (Chapter Editor), Sprint 6/7 (AI Chat Engine patterns)
- **External**: Anthropic SDK (`@anthropic-ai/sdk`), Tiptap editor

## Scope

### In Scope

- Content generation API route with streaming SSE
- System/user prompt builders with tone, expertise, and context support
- Client hook with throttled streaming and abort support
- Tiptap AiContentBlock extension for visual differentiation
- Editor toolbar integration with AI Generate button
- Auto-save of generated content on stream completion

### Out of Scope

- Tone/expertise UI controls (Sprint 12 - AI Sidebar)
- Regeneration of individual sections
- Content quality scoring
- Export integration

## Technical Approach

### Architecture

1. **API Layer**: POST route validates input, gathers context (outline, previous chapters, conversation history), and delegates to content engine
2. **Content Engine**: Uses `client.messages.stream()` with SSE encoding (text, metadata, done, error events)
3. **Client Hook**: `useChapterGeneration` manages AbortController, parses SSE events, throttles content updates via `requestAnimationFrame` + 100ms threshold
4. **Editor Integration**: Content streamed into Tiptap via `editor.commands.setContent()` — suppresses `onUpdate` during streaming (no auto-save), triggers on completion (auto-save)
5. **Visual**: AiContentBlock Tiptap Node renders amber-bordered container around AI content

### Streaming Pattern

```
Claude API → anthropicStream events → SSE chunks → ReadableStream
→ fetch body reader → parse events → throttled state updates → editor.setContent()
```

### Context Gathering

- **Key Points**: Matched from outline sections by `orderIndex`
- **Previous Chapters**: First 200 chars of content, HTML stripped
- **Conversation Context**: Last 6 exchanges from wizard history (max 500 chars)
- **Book Metadata**: Topic, audience from outline

## Tasks

### Phase 1: Planning
- [x] Review requirements and existing patterns
- [x] Design architecture with Plan agent
- [x] Clarify requirements (content replacement, throttle, context, AI block)

### Phase 2: Implementation
- [x] Create types (`src/types/chapter-generation.ts`)
- [x] Create Zod validation schema (`src/lib/validations/chapter-generation.ts`)
- [x] Build system/user prompt functions (`src/lib/ai/prompts/chapter-generation.ts`)
- [x] Add generation constants (max tokens, temperature)
- [x] Build content engine with streaming (`src/lib/ai/content-engine.ts`)
- [x] Build API route (`src/app/api/ai/generate/chapter/route.ts`)
- [x] Add `getPreviousChapterSummaries` query
- [x] Build client hook with throttled streaming (`src/hooks/use-chapter-generation.ts`)
- [x] Create AiContentBlock Tiptap extension
- [x] Integrate into editor toolbar and wrapper
- [x] Write tests (35 tests across 4 test files)

### Phase 3: Validation
- [x] All 417 tests passing (0 failures)
- [x] Quality review complete

### Phase 4: Documentation
- [x] Sprint file updated

## Acceptance Criteria

- [x] All 417 tests passing (`pnpm test`)
- [x] POST `/api/ai/generate/chapter` streams SSE events with auth
- [x] Content engine uses Claude streaming with proper prompt context
- [x] Client hook throttles updates to ~100ms
- [x] AI content visually marked with amber border in editor
- [x] Toolbar shows AI Generate button with loading state
- [x] Generated content auto-saved on stream completion

## Files Changed

### New Files (12)
- `src/types/chapter-generation.ts` — Generation types (tone, expertise, context, SSE events)
- `src/lib/validations/chapter-generation.ts` — Zod schema with UUID validation and defaults
- `src/lib/ai/prompts/chapter-generation.ts` — System/user prompt builders with tone/expertise maps
- `src/lib/ai/content-engine.ts` — `generateChapterContentStreaming()` with SSE encoding
- `src/app/api/ai/generate/chapter/route.ts` — POST endpoint with context gathering and auth
- `src/hooks/use-chapter-generation.ts` — Client hook with throttled streaming and abort
- `src/components/editor/extensions/ai-content-block.ts` — Tiptap Node extension
- `src/lib/validations/__tests__/chapter-generation.test.ts` — 11 validation tests
- `src/lib/ai/prompts/__tests__/chapter-generation.test.ts` — 18 prompt tests
- `src/hooks/__tests__/use-chapter-generation.test.ts` — 6 hook tests
- `src/components/preview/__tests__/preview-wrapper.test.tsx` — (pre-existing, no changes)
- `docs/sprints/.../sprint-11_quality-assessment.json` — Quality assessment artifact

### Modified Files (6)
- `src/lib/ai/prompts/constants.ts` — Added `GENERATION_MAX_TOKENS` (8192), `GENERATION_TEMPERATURE` (0.7)
- `src/server/queries/chapters.ts` — Added `getPreviousChapterSummaries()` query
- `src/components/editor/editor-toolbar.tsx` — Added AI Generate button (Sparkles/Loader2 icons)
- `src/components/editor/chapter-editor-layout.tsx` — Pass-through `isGenerating` and `onAiGenerate` props
- `src/components/editor/chapter-editor-wrapper.tsx` — Wired `useChapterGeneration` hook, streaming into editor
- `src/components/editor/index.ts` — Added `AiContentBlock` export

## Notes

- Tone/expertise defaults to "professional"/"intermediate" — Sprint 12 will add UI controls
- Content replaces existing editor content (not append) per clarification
- AI content wrapped in `<div data-ai-content="true">` for amber border visual treatment
- Auto-save suppressed during streaming via `setContent(html, false)`, triggered on completion

## Postmortem

See [Sprint 11 Postmortem](./sprint-11_postmortem.md)
