---
sprint: 15
title: "QA Scoring and Analysis Engine"
type: fullstack
epic: 7
status: done
created: 2026-02-13T13:13:39Z
started: 2026-02-13T17:27:21Z
completed: 2026-02-13
hours: null
workflow_version: "3.1.0"


---

# Sprint 15: QA Scoring and Analysis Engine

## Overview

| Field | Value |
|-------|-------|
| Sprint | 15 |
| Title | QA Scoring and Analysis Engine |
| Type | fullstack |
| Epic | 7 |
| Status | In Progress |
| Created | 2026-02-13 |
| Started | 2026-02-13 |
| Completed | - |

## Goal

Build the backend QA scoring and analysis engine that evaluates book chapters across four quality dimensions (readability, structure, accuracy, consistency) using Claude tool_use, with per-chapter parallel analysis and cross-chapter consistency checks.

## Background

The PRD requires a Quality Assurance screen that shows overall book quality scores and actionable suggestions. This sprint implements the backend engine that performs the AI-powered analysis, stores results in the database, and exposes an API endpoint. The QA UI (Sprint 16) will consume this engine.

## Requirements

### Functional Requirements

- [x] Analyze individual chapters across 4 dimensions (readability, structure, accuracy, consistency) scored 0-100
- [x] Run per-chapter analysis in parallel via `Promise.all()`
- [x] Cross-chapter consistency check with adjustment score (0 to -20)
- [x] Word-count-weighted score aggregation for book-level scores
- [x] Quality level derivation (exceptional/professional/good/needs-improvement/needs-significant-work)
- [x] Suggestions with severity levels (critical/major/minor) and auto-fix indicators
- [x] Store analysis results in database with JSONB columns for chapter scores and suggestions
- [x] API endpoint with auth, ownership verification, and Zod validation

### Non-Functional Requirements

- [x] Claude tool_use pattern for structured JSON output (no freeform parsing)
- [x] Low temperature (0.2) for consistent scoring
- [x] Max 10 suggestions per chapter, max 10 cross-chapter suggestions
- [x] Schema-only (db:push) — no Drizzle migrations

## Dependencies

- **Sprints**: Sprint 11 (AI Content Generation Engine - patterns for Claude tool_use)
- **External**: Anthropic SDK, Drizzle ORM

## Scope

### In Scope

- QA engine with per-chapter and cross-chapter analysis
- Database schema for qa_analyses table
- API route POST /api/qa/analyze
- Types, validation schemas, prompt builders, tool schemas
- Tests for prompts, validations, and engine pure functions

### Out of Scope

- QA Screen UI (Sprint 16)
- Auto-fix implementation (Sprint 16)
- Real-time progress streaming during analysis

## Technical Approach

Uses Claude tool_use to force structured JSON responses for scoring. Each chapter is analyzed independently in parallel, then a lightweight cross-chapter consistency pass adjusts the consistency score. Scores are aggregated using word-count-weighted averages so longer chapters contribute proportionally. Results are persisted in a `qa_analyses` table with scalar score columns and JSONB for complex data (chapterScores, suggestions).

## Files Created

| File | Purpose |
|------|---------|
| `src/types/qa-analysis.ts` | TypeScript types: QADimension, QASeverity, QualityLevel, QAChapterScore, QASuggestion, QAAnalysisResult |
| `src/lib/validations/qa-analysis.ts` | Zod schemas: qaAnalyzeRequestSchema, qaChapterResponseSchema, qaConsistencyResponseSchema |
| `src/lib/ai/prompts/qa-analysis.ts` | Prompt builders + Claude tool_use schemas for chapter analysis and consistency check |
| `src/server/db/schema/qa-analyses.ts` | Drizzle table: qa_analyses with indexes on bookId and bookId+createdAt |
| `src/server/queries/qa-analyses.ts` | getLatestQAAnalysis with ownership verification via innerJoin |
| `src/server/mutations/qa-analyses.ts` | saveQAAnalysis inserts analysis result |
| `src/lib/ai/qa-engine.ts` | Core engine: analyzeBookQuality, analyzeChapterQuality, aggregateScores, deriveQualityLevel, checkCrossChapterConsistency |
| `src/app/api/qa/analyze/route.ts` | POST endpoint with auth, validation, analysis, and persistence |
| `src/lib/ai/prompts/__tests__/qa-analysis.test.ts` | 17 tests for prompt builders and tool schemas |
| `src/lib/validations/__tests__/qa-analysis.test.ts` | 22 tests for Zod validation schemas |
| `src/lib/ai/__tests__/qa-engine.test.ts` | 12 tests for deriveQualityLevel and aggregateScores |

## Files Modified

| File | Change |
|------|--------|
| `src/lib/ai/prompts/constants.ts` | Added QA_TEMPERATURE (0.2), QA_MAX_TOKENS (4096), QA_CONSISTENCY_MAX_TOKENS (2048) |
| `src/server/db/schema/index.ts` | Added qa-analyses export |
| `src/server/db/schema/relations.ts` | Added qaAnalyses relation to books, added qaAnalysesRelations |

## Tasks

### Phase 1: Planning
- [x] Review requirements and wireframes
- [x] Design architecture (per-chapter parallel, tool_use pattern)
- [x] Clarify requirements (parallel analysis, new table, include consistency, schema-only)

### Phase 2: Implementation
- [x] Create types and validation schemas
- [x] Create prompt builders and tool schemas
- [x] Create database schema and queries/mutations
- [x] Create QA engine with orchestration
- [x] Create API route
- [x] Write tests (51 total: 17 prompt, 22 validation, 12 engine)

### Phase 3: Validation
- [x] Run full test suite (534 tests passing, 0 failing)
- [x] Quality review

### Phase 4: Documentation
- [x] Update sprint file

## Test Results

- **Total tests**: 534 passing, 0 failing
- **New tests added**: 51 (prompt: 17, validation: 22, engine: 12)
- **Duration**: ~5s

## Acceptance Criteria

- [x] All tests passing (534/534)
- [x] Per-chapter parallel analysis via Promise.all
- [x] Cross-chapter consistency check with adjustment
- [x] Word-count-weighted score aggregation
- [x] Quality level derivation from overall score
- [x] Database persistence with JSONB columns
- [x] API route with auth and Zod validation
- [x] Follows existing Claude tool_use patterns

## Notes

- Commit: `739b549` feat(sprint-15): add QA Scoring and Analysis Engine
- Created: 2026-02-13
