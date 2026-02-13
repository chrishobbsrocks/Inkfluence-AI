---
sprint: 7
title: "Wizard UI and Outline Generation"
type: fullstack
epic: 3
status: done
created: 2026-02-13T13:13:30Z
started: 2026-02-13T15:19:12Z
completed: 2026-02-14T01:00:00Z
hours: 9.5
workflow_version: "3.1.0"

---

# Sprint 7: Wizard UI and Outline Generation

## Overview

| Field | Value |
|-------|-------|
| Sprint | 7 |
| Title | Wizard UI and Outline Generation |
| Type | fullstack |
| Epic | 3 |
| Status | Done |
| Created | 2026-02-13 |
| Started | 2026-02-13 |
| Completed | 2026-02-13 |

## Goal

Build the frontend UI for the Knowledge Extraction Wizard — a full-screen chat interface that consumes Sprint 6's backend to interview users and generate book outlines.

## Background

Sprint 6 built the entire backend engine (Claude API client, streaming chat, prompt system, outline generation). This sprint builds the React UI: a chat interface with phase stepper, SSE streaming display, and outline review/display screens.

## Requirements

### Functional Requirements

- [ ] Full-screen wizard chat interface (fixed overlay, no sidebar)
- [ ] 5-step phase stepper (Topic, Audience, Expertise, Outline, Review)
- [ ] Chat message bubbles (AI with sparkles avatar, User with initial)
- [ ] SSE streaming hook consuming POST /api/ai/chat
- [ ] Real-time text streaming display with typing indicator
- [ ] Chat input with send button and question counter
- [ ] Gap suggestion messages with Accept/Skip action buttons
- [ ] Wizard start form (topic, audience, expertise level inputs)
- [ ] Outline generation trigger when wizard reaches completion
- [ ] Outline display with chapter list and key points
- [ ] AI recommendations panel showing detected gaps
- [ ] Record/Upload buttons as disabled placeholders with tooltips

### Non-Functional Requirements

- [ ] All existing 175 tests continue to pass
- [ ] Matches hi-fi wireframe design (Stone palette, DM Sans/Instrument Serif)
- [ ] Accessible (keyboard navigation, ARIA attributes)
- [ ] No TanStack Query — uses server actions + SSE fetch

## Dependencies

- **Sprints**: Sprint 6 (Claude API Integration and Chat Engine — backend)
- **External**: shadcn/ui ScrollArea and Tooltip components

## Scope

### In Scope

- Wizard chat UI (full-screen overlay)
- SSE streaming custom hook
- Phase stepper component
- Chat message components (AI, User, Gap Suggestion, Typing Indicator)
- Chat input with send/counter
- Wizard start form
- Outline preview (generate + review)
- Outline display page (chapter list + AI panel)
- Component tests

### Out of Scope

- Drag-and-drop chapter reordering (Sprint 9)
- Voice recording / file upload functionality (P2)
- Content generation from outline (Sprint 11)
- Rich text editor (Sprint 10)
- Outline editing (Sprint 9)

## Technical Approach

### Architecture
- **Wizard as overlay**: Full-screen `fixed inset-0 z-50` overlay covering sidebar layout
- **SSE streaming**: Custom `useStreamingChat` hook using `fetch` + `ReadableStream` (not EventSource, since endpoint is POST)
- **State routing**: Server component checks outline/sections state to decide wizard vs display mode
- **Gap suggestions**: Action buttons on AI messages with Accept/Skip, sending user message through chat

### Component Hierarchy
```
outline/page.tsx (Server Component)
├── WizardContainer (if no outline/sections)
│   ├── WizardHeader (logo + stepper + save/exit)
│   ├── WizardStartForm (initial topic entry)
│   ├── ChatMessageList (scrollable messages)
│   │   ├── ChatMessage (AI/User variants)
│   │   ├── GapSuggestionMessage (with buttons)
│   │   └── TypingIndicator
│   ├── ChatInput (text + send + counter)
│   └── OutlinePreview (generate + review)
└── OutlineDisplay (if outline with sections)
    ├── OutlineHeader
    ├── OutlineChapterItem (per chapter)
    └── AiRecommendationsPanel
```

## Tasks

### Phase 1: Planning
- [x] Review requirements
- [x] Design architecture
- [x] Clarify requirements

### Phase 2: Implementation
- [x] Install shadcn ScrollArea + Tooltip
- [x] Create useStreamingChat hook
- [x] Create format-chat-content utility
- [x] Create wizard components (stepper, messages, input, header, start form)
- [x] Create outline preview component
- [x] Create outline display components
- [x] Modify outline page (server component routing)
- [x] Write component and hook tests

### Phase 3: Validation
- [x] All existing tests pass
- [x] All new tests pass
- [x] Matches wireframe design

### Phase 4: Documentation
- [x] Sprint file updated with results

## Acceptance Criteria

- [x] Wizard shows as full-screen overlay when no outline exists
- [x] Phase stepper correctly reflects current wizard phase
- [x] Chat messages stream in real-time via SSE
- [x] Typing indicator shows while AI is responding
- [x] Gap suggestions display with Accept/Skip buttons
- [x] Question counter shows progress (e.g., "Question 5 of ~12")
- [x] Outline generation can be triggered from wizard
- [x] Generated outline displays with chapters and key points
- [x] Outline display shows when sections exist in database
- [x] All existing tests pass (no regressions)
- [x] New component tests cover key interactions

## Functional Requirements

- [x] Full-screen wizard chat interface (fixed overlay, no sidebar)
- [x] 5-step phase stepper (Topic, Audience, Expertise, Outline, Review)
- [x] Chat message bubbles (AI with sparkles avatar, User with initial)
- [x] SSE streaming hook consuming POST /api/ai/chat
- [x] Real-time text streaming display with typing indicator
- [x] Chat input with send button and question counter
- [x] Gap suggestion messages with Accept/Skip action buttons
- [x] Wizard start form (topic, audience, expertise level inputs)
- [x] Outline generation trigger when wizard reaches completion
- [x] Outline display with chapter list and key points
- [x] AI recommendations panel showing detected gaps
- [x] Record/Upload buttons as disabled placeholders with tooltips

## Results

### Files Created (27)
| File | Purpose |
|------|---------|
| `src/hooks/use-streaming-chat.ts` | SSE streaming hook for chat |
| `src/lib/format-chat-content.tsx` | Minimal markdown rendering for chat messages |
| `src/lib/ai/wizard-state.ts` | Client-safe pure functions (deriveWizardState, determinePhase) |
| `src/components/wizard/wizard-container.tsx` | Main wizard orchestrator |
| `src/components/wizard/wizard-header.tsx` | Header with logo, stepper, save/exit |
| `src/components/wizard/wizard-stepper.tsx` | 5-step phase progress indicator |
| `src/components/wizard/wizard-start-form.tsx` | Initial topic/audience entry form |
| `src/components/wizard/chat-message.tsx` | AI/User message bubbles |
| `src/components/wizard/chat-message-list.tsx` | Scrollable message list with auto-scroll |
| `src/components/wizard/chat-input.tsx` | Input with send, record, upload, counter |
| `src/components/wizard/gap-suggestion-message.tsx` | AI gap suggestion with action buttons |
| `src/components/wizard/typing-indicator.tsx` | Animated typing dots |
| `src/components/wizard/outline-preview.tsx` | Generate and review outline |
| `src/components/wizard/index.ts` | Barrel export |
| `src/components/outline/outline-display.tsx` | Grid layout with chapters + AI panel |
| `src/components/outline/outline-chapter-item.tsx` | Chapter row with key points |
| `src/components/outline/outline-header.tsx` | Outline page header with actions |
| `src/components/outline/ai-recommendations-panel.tsx` | Gap suggestions panel |
| `src/components/outline/index.ts` | Barrel export |
| `src/components/ui/scroll-area.tsx` | shadcn ScrollArea |
| `src/components/ui/tooltip.tsx` | shadcn Tooltip |
| `src/app/(app)/books/[bookId]/outline/loading.tsx` | Loading skeleton |
| `src/components/wizard/__tests__/` | 5 test files (stepper, message, input, gaps, typing) |
| `src/components/outline/__tests__/` | 2 test files (chapter, display) |
| `src/tests/wizard-state.test.ts` | Tests for extracted wizard-state module |

### Files Modified (3)
| File | Change |
|------|--------|
| `src/app/(app)/books/[bookId]/outline/page.tsx` | Server component routing between wizard and outline display |
| `src/app/layout.tsx` | Added TooltipProvider wrapper |
| `src/lib/ai/chat-engine.ts` | Extracted pure functions to wizard-state.ts, re-exports |

### Test Results
- **40 new tests** added (all passing)
- **215 total tests** across 35 files (all passing)
- Duration: ~3.0s

## Postmortem

### What Went Well
- Clean component architecture following wireframe specifications closely
- Successfully extracted client-safe pure functions from server-only chat-engine
- SSE streaming hook handles all edge cases (abort, error, chunk boundaries)
- All 40 new tests passed on first run, no regressions in existing 175 tests

### Issues Encountered
- **Client/server boundary**: `chat-engine.ts` imports Anthropic SDK (server-only), but `WizardContainer` needs `deriveWizardState`. Solved by extracting pure functions to `wizard-state.ts` and re-exporting from chat-engine
- Sprint file was blank template again, requirements derived from PRD/wireframes

### Technical Decisions
- Full-screen overlay (`fixed inset-0 z-50`) for wizard — avoids layout/routing changes
- `fetch` + `ReadableStream` for SSE (not `EventSource`) since endpoint is POST
- Disabled Record/Upload buttons with tooltips as P2 placeholders per wireframes
- `formatChatContent` handles `**bold**` and line breaks without a markdown library

## Notes

Created: 2026-02-13
Team: Dev Team 2
