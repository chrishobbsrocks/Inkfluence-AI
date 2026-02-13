# Sprint 6: Claude API Integration and Chat Engine

## Overview

| Field | Value |
|-------|-------|
| Sprint | 6 |
| Title | Claude API Integration and Chat Engine |
| Epic | 3 - AI Knowledge Extraction Wizard |
| Status | Planning |
| Created | 2026-02-13 |
| Started | - |
| Completed | - |

## Goal

Build the core Claude API integration with streaming responses and the conversation engine that powers the Knowledge Extraction Wizard.

## Background

The Knowledge Extraction Wizard is Inkfluence AI's core differentiator. It uses Claude to conduct an interview-style conversation that extracts the user's expertise and generates a book outline. This sprint builds the underlying AI infrastructure — the Claude API client, streaming handler, conversation state management, and prompt engineering for knowledge extraction.

## Requirements

### Functional Requirements

- [ ] Anthropic SDK integration with Claude API
- [ ] Streaming response handler for real-time AI output
- [ ] Conversation state management (store and retrieve conversation history)
- [ ] System prompt for knowledge extraction interviews
- [ ] Follow-up question generation based on user responses
- [ ] Knowledge gap detection in conversation
- [ ] API route for chat messages with streaming response
- [ ] Conversation persistence in database (linked to outline)

### Non-Functional Requirements

- [ ] Streaming works reliably without dropped connections
- [ ] Conversation history managed efficiently (token-aware truncation)
- [ ] API key secured server-side only (never exposed to client)
- [ ] Rate limiting on AI API calls
- [ ] Error handling for API failures, timeouts, rate limits

## Dependencies

- **Sprints**: Sprint 2 (database for conversation storage), Sprint 4 (book model to link conversations)
- **External**: Anthropic API key (ANTHROPIC_API_KEY env var)

## Scope

### In Scope

- Anthropic SDK setup and configuration
- Streaming chat API route
- System prompts for knowledge extraction
- Conversation state management
- Knowledge gap detection prompts
- Database storage for conversation history
- Error handling and retry logic

### Out of Scope

- Wizard UI (Sprint 7)
- Outline generation from conversation (Sprint 7)
- Voice input (deferred to post-MVP)

## Technical Approach

### Architecture
```
Client → POST /api/chat/wizard → Claude API (streaming) → SSE to client
                                       ↕
                              Conversation history (DB)
```

### System Prompt Strategy
The wizard uses a multi-phase system prompt:
1. **Topic Discovery**: "What topic do you want to write about? Who is your target audience?"
2. **Expertise Extraction**: "What's the #1 mistake you see? Can you share a framework?"
3. **Gap Detection**: "I notice you haven't mentioned X — would you like to cover that?"
4. **Outline Formation**: After ~10-12 questions, synthesize into outline

### Key Implementation Details
- Use `@anthropic-ai/sdk` with streaming via `client.messages.stream()`
- Store conversation as JSONB array in outlines.conversation_history
- Use Server-Sent Events (SSE) for streaming to client
- Token counting to manage context window
- System prompt evolves based on conversation phase (topic → expertise → gaps → outline)

### API Route Design
```typescript
// POST /api/chat/wizard
// Body: { bookId, message, conversationPhase }
// Response: SSE stream of Claude's response
```

## Tasks

### Phase 1: Planning
- [ ] Design system prompts for each conversation phase
- [ ] Design conversation state schema

### Phase 2: Implementation
- [ ] Install @anthropic-ai/sdk
- [ ] Create Claude client wrapper (src/lib/ai/claude.ts)
- [ ] Implement streaming chat handler
- [ ] Design and test system prompts for knowledge extraction
- [ ] Create conversation state manager
- [ ] Build API route POST /api/chat/wizard with SSE streaming
- [ ] Implement conversation phase detection (auto-advance through phases)
- [ ] Add knowledge gap detection to system prompts
- [ ] Store and retrieve conversation history from database
- [ ] Add error handling, retry logic, and rate limiting

### Phase 3: Validation
- [ ] Streaming responses work end-to-end
- [ ] Conversation maintains context across multiple messages
- [ ] Gap detection triggers appropriately
- [ ] Conversation persists and can be resumed
- [ ] Error states handled gracefully

## Acceptance Criteria

- [ ] Claude API responds with streaming text via SSE
- [ ] Conversation history persists in database
- [ ] System prompts extract meaningful knowledge through follow-up questions
- [ ] Knowledge gap detection identifies missing topics
- [ ] Can resume a conversation after page refresh
- [ ] API errors return appropriate error responses (not 500s)
- [ ] No API key exposure in client-side code
- [ ] TypeScript types for all message/conversation structures

## Notes

Use Claude claude-sonnet-4-5-20250929 for the wizard (balance of speed and quality).
Reserve Claude claude-opus-4-6 for content generation in Sprint 11 where quality matters more.
The wizard should feel like talking to a smart editor, not a chatbot.
