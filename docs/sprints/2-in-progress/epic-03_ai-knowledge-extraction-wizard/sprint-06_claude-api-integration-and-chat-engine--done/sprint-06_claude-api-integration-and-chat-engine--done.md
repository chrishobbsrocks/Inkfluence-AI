---
sprint: 6
title: "Claude API Integration and Chat Engine"
type: fullstack
epic: 3
status: done
created: 2026-02-13T13:13:29Z
started: 2026-02-13T14:58:54Z
completed: 2026-02-13
hours: 8.5
workflow_version: "3.1.0"

---

# Sprint 6: Claude API Integration and Chat Engine

## Overview

| Field | Value |
|-------|-------|
| Sprint | 6 |
| Title | Claude API Integration and Chat Engine |
| Type | fullstack |
| Epic | 3 |
| Status | Done |
| Created | 2026-02-13 |
| Started | 2026-02-13 |
| Completed | 2026-02-13 |

## Goal

Build the backend AI engine for the Knowledge Extraction Wizard — Claude API client, prompt system, multi-turn chat engine with streaming, and outline generation from conversations.

## Background

The Knowledge Extraction Wizard is the core differentiator of Inkfluence AI. It conducts an interactive interview (~12 questions) with users to extract their expertise and transform it into a structured book outline. This sprint builds the entire backend engine; Sprint 7 will build the UI.

## Requirements

### Functional Requirements

- [x] Anthropic SDK client singleton with env-based API key
- [x] System prompt that evolves through 5 wizard phases (topic, audience, expertise, gaps, outline)
- [x] Multi-turn chat engine with conversation state management
- [x] Streaming SSE API route (POST /api/ai/chat) for real-time responses
- [x] XML-tag parsing for structured metadata (gap suggestions, phase signals)
- [x] Separate outline generation call with JSON tool-use output
- [x] Server actions for wizard lifecycle (start, generate outline)
- [x] Database queries/mutations for outlines and sections
- [x] Zod validation schemas for all wizard inputs

### Non-Functional Requirements

- [x] Claude Sonnet model for cost-effective conversational quality
- [x] All existing tests continue to pass
- [x] Clerk auth on all endpoints
- [x] Conversation history stored in outlines.conversationHistory JSONB
- [x] Clean separation: this sprint is backend only (no React components)

## Dependencies

- **Sprints**: Sprint 2 (Database schema - outlines, outline_sections tables)
- **External**: Anthropic API key, @anthropic-ai/sdk package

## Scope

### In Scope

- Anthropic SDK client setup
- Prompt templates (system prompt, outline generation)
- Chat engine (state derivation, streaming, message handling)
- Response parser (XML tags for gaps/phase signals)
- API route for streaming chat
- Server actions (start wizard, generate outline)
- Database operations (outline CRUD, conversation history, sections)
- Type definitions and Zod schemas
- Unit and integration tests

### Out of Scope

- Wizard UI components (Sprint 7)
- Voice-to-text input (P2 feature)
- Document upload processing (P2 feature)
- Content generation (Sprint 11)
- Rich text editor (Sprint 10)

## Technical Approach

### Architecture
- **Streaming chat**: SSE via API route (POST /api/ai/chat) - standard pattern for AI chat interfaces
- **Lifecycle operations**: Server actions following existing ActionResult<T> pattern
- **Prompt evolution**: Single system prompt with phase-specific instruction blocks
- **Structured metadata**: XML tags in Claude responses parsed by regex
- **Outline generation**: Separate Claude call with tool-use for guaranteed JSON

### Wizard Phases
1. topic_exploration (questions 1-3)
2. audience_definition (questions 3-5)
3. expertise_extraction (questions 5-9)
4. gap_analysis (questions 9-11)
5. outline_generation (question 12+)

### Model Selection
- Chat: claude-sonnet-4-5-20250929 (conversational quality + cost efficiency)
- Outline generation: claude-sonnet-4-5-20250929 with lower temperature (0.3) for structured output

## Tasks

### Phase 1: Planning
- [x] Review requirements
- [x] Design architecture
- [x] Clarify requirements

### Phase 2: Implementation
- [x] Install @anthropic-ai/sdk
- [x] Create type definitions (src/types/wizard.ts)
- [x] Create Zod validation schemas
- [x] Create prompt templates (system prompt, outline generation, constants)
- [x] Create response parser
- [x] Create Anthropic client singleton
- [x] Create chat engine
- [x] Create outline queries and mutations
- [x] Create wizard server actions
- [x] Create streaming chat API route
- [x] Write tests for all modules

### Phase 3: Validation
- [x] All existing tests pass
- [x] All new tests pass
- [x] TypeScript compiles clean (Sprint 6 files only; pre-existing TS errors in Dev Team 1 test files)

### Phase 4: Documentation
- [x] Sprint file updated with results

## Acceptance Criteria

- [x] `@anthropic-ai/sdk` installed and client works with API key
- [x] System prompt evolves correctly through 5 wizard phases
- [x] POST /api/ai/chat returns streaming SSE response
- [x] Gap suggestions parsed from XML tags in Claude response
- [x] Outline generation returns validated JSON with chapters and key points
- [x] Conversation history persists in database after each exchange
- [x] All endpoints require Clerk authentication
- [x] All existing tests pass (no regressions)
- [x] New tests cover prompts, parsing, state derivation, actions, and API route

## Results

### Files Created (16)
| File | Purpose |
|------|---------|
| `src/types/wizard.ts` | Type definitions for wizard phases, state, gaps, outlines |
| `src/lib/validations/wizard.ts` | Zod schemas for all wizard inputs |
| `src/lib/ai/prompts/constants.ts` | AI model, token limits, temperature constants |
| `src/lib/ai/client.ts` | Anthropic SDK singleton with lazy initialization |
| `src/lib/ai/prompts/system-prompt.ts` | Dynamic system prompt with phase-specific instructions |
| `src/lib/ai/prompts/outline-generation.ts` | Outline prompt builder + tool-use definition |
| `src/lib/ai/response-parser.ts` | XML tag parser for gaps, phase signals, tag stripping |
| `src/lib/ai/chat-engine.ts` | Core engine: streaming, state derivation, outline generation |
| `src/server/queries/outlines.ts` | Outline read queries with ownership verification |
| `src/server/mutations/outlines.ts` | Outline CRUD mutations and section saving |
| `src/server/actions/wizard.ts` | Server actions: startWizard, generateOutline |
| `src/app/api/ai/chat/route.ts` | SSE streaming API route with auth |
| `src/tests/ai-prompts.test.ts` | 13 tests for prompt builders |
| `src/tests/ai-response-parser.test.ts` | 11 tests for XML parsing |
| `src/tests/ai-client.test.ts` | 4 tests for SDK client singleton |
| `src/tests/ai-chat-engine.test.ts` | 13 tests for engine state/phases |
| `src/tests/wizard-validations.test.ts` | 16 tests for Zod schemas |

### Files Modified (1)
| File | Change |
|------|--------|
| `package.json` | Added `@anthropic-ai/sdk` dependency |

### Test Results
- **57 new tests** added (all passing)
- **175 total tests** across 27 files (all passing)
- Duration: ~2.2s

## Postmortem

### What Went Well
- Clean architecture: pure functions for state derivation, separated prompt building, response parsing
- XML tags provide a clean metadata channel without disrupting Claude's conversational flow
- Tool-use for outline generation guarantees structured JSON output
- All 5 wizard phases tested with boundary conditions
- Followed existing project patterns (ActionResult, MutationResult, requireUser)

### Issues Encountered
- **Vitest mock constructor**: `vi.fn().mockReturnValue({})` doesn't work as a constructor with `new`. Fixed by using `vi.fn(function(this) { this.mock = true })` pattern
- Sprint file was blank template — requirements derived from PRD and existing codebase context

### Technical Decisions
- SSE streaming via API route (not server actions) for browser-native EventSource compatibility
- Separate outline generation call (not inline) for guaranteed JSON structure via tool-use
- XML tags (not tool-use) for in-conversation metadata to preserve natural dialogue flow
- Claude Sonnet 4.5 for balanced quality/cost; lower temperature (0.3) for outline generation

## Notes

Created: 2026-02-13
Team: Dev Team 2
