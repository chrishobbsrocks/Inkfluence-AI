---
sprint: 16
title: "QA UI and Auto Fix"
type: fullstack
epic: 7
status: in-progress
created: 2026-02-13T13:13:40Z
started: 2026-02-13T17:48:02Z
completed: null
hours: null
workflow_version: "3.1.0"

---

# Sprint 16: QA UI and Auto Fix

## Overview

| Field | Value |
|-------|-------|
| Sprint | 16 |
| Title | QA UI and Auto Fix |
| Type | fullstack |
| Epic | 7 |
| Status | In Progress |
| Created | 2026-02-13 |
| Started | 2026-02-13 |
| Completed | - |

## Goal

Build the QA dashboard UI with overall/per-chapter quality scores, suggestion list, auto-fix capability, and "Fix All Issues" batch operation.

## Background

Sprint 15 built the QA analysis backend (scoring engine, database, API). This sprint adds the user-facing QA screen matching the wireframe design: overall score card, chapter scores list, suggestions with auto-fix buttons, and re-run analysis capability.

## Requirements

### Functional Requirements

- [x] QA dashboard page with auth and data fetching
- [x] Overall score card with circular badge and 4 dimension scores
- [x] Per-chapter scores list with suggestion counts
- [x] Suggestions list with severity badges and auto-fix buttons
- [x] Auto-fix API endpoint (text find-and-replace in chapter content)
- [x] "Fix All Issues" batch operation (sequential fixes)
- [x] Re-run analysis button
- [x] Empty state when no analysis exists
- [x] Chapter filter (View button filters suggestions to that chapter)
- [x] Loading spinners during analysis and fix operations

### Non-Functional Requirements

- [x] Single-column layout matching wireframe
- [x] 39 new tests (all passing)
- [x] 573 total tests passing (0 regressions)

## Dependencies

- **Sprints**: Sprint 15 (QA Scoring and Analysis Engine)
- **External**: None (uses existing Anthropic SDK via Sprint 15)

## Scope

### In Scope

- QA page server component with auth and data fetching
- QA client wrapper with useQAAnalysis hook
- Overall score card, chapter scores card, suggestions card
- Auto-fix API route (POST /api/qa/fix)
- Text replacement in HTML content
- Fix validation schema
- Component and validation tests

### Out of Scope

- Real-time streaming during analysis (deferred)
- Suggestion filtering by dimension/severity (basic chapter filter only)
- History of past analyses

## Technical Approach

Follows the Server Component → Client Wrapper pattern. Server page fetches latest saved analysis from DB, passes to QAWrapper client component. The useQAAnalysis hook manages analysis state, re-run via POST /api/qa/analyze, and fix operations via POST /api/qa/fix. Auto-fix uses text find-and-replace with HTML-aware matching (handles text split across HTML tags).

## Files Created

| File | Purpose |
|------|---------|
| `src/components/qa/qa-wrapper.tsx` | Client wrapper managing analysis state and fix operations |
| `src/components/qa/qa-header.tsx` | Header with Re-run and Fix All buttons |
| `src/components/qa/qa-empty-state.tsx` | Empty state when no analysis exists |
| `src/components/qa/qa-overall-score-card.tsx` | Overall score with circular badge + 4 dimension scores |
| `src/components/qa/qa-score-badge.tsx` | Circular score display with color coding |
| `src/components/qa/qa-dimension-score.tsx` | Single dimension score display |
| `src/components/qa/qa-chapter-scores-card.tsx` | Chapter list with per-chapter scores |
| `src/components/qa/qa-suggestions-card.tsx` | Suggestions list with fix buttons |
| `src/components/qa/qa-suggestion-item.tsx` | Single suggestion row with auto-fix action |
| `src/components/qa/index.ts` | Barrel export |
| `src/hooks/use-qa-analysis.ts` | Hook managing analysis fetch, re-run, and fix state |
| `src/app/api/qa/fix/route.ts` | POST endpoint for applying auto-fixes |
| `src/lib/validations/qa-fix.ts` | Zod schema for fix request validation |
| `src/components/qa/__tests__/qa-wrapper.test.tsx` | 13 wrapper integration tests |
| `src/components/qa/__tests__/qa-overall-score-card.test.tsx` | 7 score card tests |
| `src/components/qa/__tests__/qa-suggestions-card.test.tsx` | 12 suggestions tests |
| `src/lib/validations/__tests__/qa-fix.test.ts` | 7 validation tests |

## Files Modified

| File | Change |
|------|--------|
| `src/app/(app)/books/[bookId]/qa/page.tsx` | Converted from placeholder to full server component |
| `src/types/qa-analysis.ts` | Added QAFixRequest and QAFixResponse interfaces |

## Tasks

### Phase 1: Planning
- [x] Read sprint spec and wireframe
- [x] Design architecture (component hierarchy, hook, API)
- [x] Clarify requirements (text replacement, single-column, chapter filter)

### Phase 2: Implementation
- [x] Add fix types to qa-analysis.ts
- [x] Create fix validation schema
- [x] Create POST /api/qa/fix route with text replacement
- [x] Create useQAAnalysis hook
- [x] Create all QA UI components (9 components)
- [x] Update QA page from placeholder to server component
- [x] Write 39 tests

### Phase 3: Validation
- [x] All 573 tests passing (39 new, 0 regressions)
- [x] Build passes cleanly

## Test Results

- **Total tests**: 573 passing, 0 failing
- **New tests added**: 39 (wrapper: 13, score card: 7, suggestions: 12, validation: 7)

## Acceptance Criteria

- [x] QA dashboard UI matches wireframe design
- [x] Overall quality score (0-100) displayed with quality level
- [x] Per-chapter quality scores with suggestion counts
- [x] Suggestions list with severity badges
- [x] Auto-fix buttons for fixable suggestions
- [x] "Fix All Issues" batch operation
- [x] Re-run analysis capability
- [x] Empty state when no analysis exists
- [x] Chapter filter via View button
- [x] Loading states during operations

## Notes

Created: 2026-02-13
