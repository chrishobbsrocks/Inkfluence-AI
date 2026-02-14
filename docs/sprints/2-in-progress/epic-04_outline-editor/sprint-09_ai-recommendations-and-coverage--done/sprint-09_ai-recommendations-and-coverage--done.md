---
sprint: 9
title: "AI Recommendations and Coverage"
type: fullstack
epic: 4
status: done
created: 2026-02-13T13:13:32Z
started: 2026-02-13T16:16:53Z
completed: 2026-02-13
hours: 1.5
workflow_version: "3.1.0"


---

# Sprint 9: AI Recommendations and Coverage

## Overview

| Field | Value |
|-------|-------|
| Sprint | 9 |
| Title | AI Recommendations and Coverage |
| Type | fullstack |
| Epic | 4 |
| Status | In Progress |
| Created | 2026-02-13 |
| Started | 2026-02-13 |
| Completed | - |

## Goal

Transform the static AI recommendations panel into a dynamic, real-time analysis system that evaluates outline coverage and suggests new chapters using Claude tool-use.

## Background

The existing AI recommendations panel (from Sprint 7) only displayed static gap suggestions extracted from the wizard conversation history. It could not react to user edits or provide actionable suggestions. This sprint replaces it with a live AI analysis system that evaluates the current outline structure, identifies coverage gaps, suggests new chapters at specific positions, and provides an overall completeness score.

## Requirements

### Functional Requirements

- [x] AI analyzes outline chapters and provides structured suggestions via Claude tool-use
- [x] Suggestions include chapter title, key points, rationale, insert position, and priority
- [x] Coverage assessment shows topic areas rated as well-covered, partial, or gap
- [x] Overall completeness score (0-100) displayed prominently
- [x] Users can "Add" a suggestion (inserts chapter at AI-recommended position)
- [x] Users can "Dismiss" a suggestion (hidden for current session)
- [x] Auto re-analysis triggers 3 seconds after chapter count changes (debounced)
- [x] Manual "Refresh" button for on-demand re-analysis

### Non-Functional Requirements

- [x] Dismissed suggestions stored in client state only (no DB migration)
- [x] Loading skeleton shown during initial analysis
- [x] Error state with retry button
- [x] AbortController cancels in-flight requests on unmount or new request

## Dependencies

- **Sprints**: Sprint 8 (Outline Editor UI)
- **External**: Anthropic Claude API

## Scope

### In Scope

- New `POST /api/outline/analyze` endpoint
- `analyzeOutline` function in chat-engine using tool-use
- `useOutlineAnalysis` hook with debounced re-analysis
- Full rewrite of `AiRecommendationsPanel` component
- Extended `ADD_CHAPTER` reducer action for `insertAfterIndex` and `keyPoints`
- Removal of static `gaps` prop from `OutlineEditorWrapper` and page

### Out of Scope

- Persisting dismissed suggestions in the database
- Streaming analysis responses
- Per-chapter analysis or editing suggestions

## Technical Approach

Uses Claude tool-use (`tool_choice: { type: "tool", name: "analyze_outline" }`) to get structured JSON output. The API route authenticates via Clerk, validates with Zod, verifies outline ownership, and calls `analyzeOutline`. The client hook fetches on mount, debounces re-fetches on section count changes, and supports manual refresh. The panel renders suggestions with Add/Dismiss actions, coverage icons, and completeness score.

## Tasks

### Phase 1: Planning
- [x] Review requirements
- [x] Design architecture
- [x] Clarify requirements

### Phase 2: Implementation
- [x] Create types (`src/types/outline-analysis.ts`)
- [x] Create AI prompt with tool-use (`src/lib/ai/prompts/outline-analysis.ts`)
- [x] Create Zod validations (`src/lib/validations/outline-analysis.ts`)
- [x] Add `analyzeOutline` to chat-engine
- [x] Create API route (`POST /api/outline/analyze`)
- [x] Create `useOutlineAnalysis` hook
- [x] Rewrite `AiRecommendationsPanel` component
- [x] Extend `ADD_CHAPTER` reducer for `insertAfterIndex`/`keyPoints`
- [x] Wire up `OutlineEditorWrapper` with analysis hook
- [x] Remove `gaps` prop from page and wrapper

### Phase 3: Validation
- [x] Write tests (prompt, validations, panel, hook, reducer)
- [x] Fix collateral test failures (outline-display, editor-toolbar)
- [x] All 349 tests passing

### Phase 4: Documentation
- [x] Update sprint file

## Acceptance Criteria

- [x] All 349 tests passing (88 new)
- [x] AI analysis returns structured suggestions and coverage via tool-use
- [x] Add button inserts chapter at AI-recommended position
- [x] Dismiss button hides suggestion for session
- [x] Auto re-analysis on chapter count change (3s debounce)
- [x] Manual refresh button works
- [x] Loading, error, and success states render correctly

## Files Changed

### New Files (7)
- `src/types/outline-analysis.ts` — Types for suggestions, coverage, analysis
- `src/lib/ai/prompts/outline-analysis.ts` — AI prompt builder and tool definition
- `src/lib/validations/outline-analysis.ts` — Zod schemas for request and response
- `src/app/api/outline/analyze/route.ts` — POST endpoint for outline analysis
- `src/hooks/use-outline-analysis.ts` — Client hook with debounced re-analysis
- `src/lib/ai/prompts/__tests__/outline-analysis.test.ts` — Prompt builder tests (12)
- `src/lib/validations/__tests__/outline-analysis.test.ts` — Validation tests (13)

### Modified Files (7)
- `src/lib/ai/chat-engine.ts` — Added `analyzeOutline` function
- `src/hooks/use-outline-editor.ts` — Extended ADD_CHAPTER for insertAfterIndex/keyPoints
- `src/components/outline/ai-recommendations-panel.tsx` — Full rewrite with dynamic analysis
- `src/components/outline/outline-editor-wrapper.tsx` — Wired analysis hook, removed gaps prop
- `src/components/outline/outline-display.tsx` — Removed AiRecommendationsPanel (no longer needed here)
- `src/app/(app)/books/[bookId]/outline/page.tsx` — Removed gaps extraction and prop
- `src/tests/setup.ts` — Added ResizeObserver polyfill

### Updated Test Files (3)
- `src/components/outline/__tests__/ai-recommendations-panel.test.tsx` — Rewritten (17 tests)
- `src/components/outline/__tests__/outline-display.test.tsx` — Updated for new interface (4 tests)
- `src/hooks/__tests__/use-outline-analysis.test.ts` — New hook tests (7 tests)

## Notes

Created: 2026-02-13
