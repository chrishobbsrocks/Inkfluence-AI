---
sprint: 6
title: "Claude API Integration and Chat Engine"
type: fullstack
epic: 3
status: in-progress
created: 2026-02-13T13:13:29Z
started: 2026-02-13T14:58:54Z
completed: null
hours: null
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
| Status | In Progress |
| Created | 2026-02-13 |
| Started | 2026-02-13 |
| Completed | - |

## Goal

Build the backend AI engine for the Knowledge Extraction Wizard — Claude API client, prompt system, multi-turn chat engine with streaming, and outline generation from conversations.

## Background

The Knowledge Extraction Wizard is the core differentiator of Inkfluence AI. It conducts an interactive interview (~12 questions) with users to extract their expertise and transform it into a structured book outline. This sprint builds the entire backend engine; Sprint 7 will build the UI.

## Requirements

### Functional Requirements

- [ ] Anthropic SDK client singleton with env-based API key
- [ ] System prompt that evolves through 5 wizard phases (topic, audience, expertise, gaps, outline)
- [ ] Multi-turn chat engine with conversation state management
- [ ] Streaming SSE API route (POST /api/ai/chat) for real-time responses
- [ ] XML-tag parsing for structured metadata (gap suggestions, phase signals)
- [ ] Separate outline generation call with JSON tool-use output
- [ ] Server actions for wizard lifecycle (start, generate outline)
- [ ] Database queries/mutations for outlines and sections
- [ ] Zod validation schemas for all wizard inputs

### Non-Functional Requirements

- [ ] Claude Sonnet model for cost-effective conversational quality
- [ ] All existing tests continue to pass
- [ ] Clerk auth on all endpoints
- [ ] Conversation history stored in outlines.conversationHistory JSONB
- [ ] Clean separation: this sprint is backend only (no React components)

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
- [ ] Install @anthropic-ai/sdk
- [ ] Create type definitions (src/types/wizard.ts)
- [ ] Create Zod validation schemas
- [ ] Create prompt templates (system prompt, outline generation, constants)
- [ ] Create response parser
- [ ] Create Anthropic client singleton
- [ ] Create chat engine
- [ ] Create outline queries and mutations
- [ ] Create wizard server actions
- [ ] Create streaming chat API route
- [ ] Write tests for all modules

### Phase 3: Validation
- [ ] All existing tests pass
- [ ] All new tests pass
- [ ] TypeScript compiles clean

### Phase 4: Documentation
- [ ] Sprint file updated with results

## Acceptance Criteria

- [ ] `@anthropic-ai/sdk` installed and client works with API key
- [ ] System prompt evolves correctly through 5 wizard phases
- [ ] POST /api/ai/chat returns streaming SSE response
- [ ] Gap suggestions parsed from XML tags in Claude response
- [ ] Outline generation returns validated JSON with chapters and key points
- [ ] Conversation history persists in database after each exchange
- [ ] All endpoints require Clerk authentication
- [ ] All existing tests pass (no regressions)
- [ ] New tests cover prompts, parsing, state derivation, actions, and API route

## Notes

Created: 2026-02-13
Team: Dev Team 2
