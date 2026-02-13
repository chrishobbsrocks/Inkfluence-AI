---
sprint: 7
title: "Wizard UI and Outline Generation"
type: fullstack
epic: 3
status: in-progress
created: 2026-02-13T13:13:30Z
started: 2026-02-13T15:19:12Z
completed: null
hours: null
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
| Status | In Progress |
| Created | 2026-02-13 |
| Started | 2026-02-13 |
| Completed | - |

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
- [ ] Install shadcn ScrollArea + Tooltip
- [ ] Create useStreamingChat hook
- [ ] Create format-chat-content utility
- [ ] Create wizard components (stepper, messages, input, header, start form)
- [ ] Create outline preview component
- [ ] Create outline display components
- [ ] Modify outline page (server component routing)
- [ ] Write component and hook tests

### Phase 3: Validation
- [ ] All existing tests pass
- [ ] All new tests pass
- [ ] Matches wireframe design

### Phase 4: Documentation
- [ ] Sprint file updated with results

## Acceptance Criteria

- [ ] Wizard shows as full-screen overlay when no outline exists
- [ ] Phase stepper correctly reflects current wizard phase
- [ ] Chat messages stream in real-time via SSE
- [ ] Typing indicator shows while AI is responding
- [ ] Gap suggestions display with Accept/Skip buttons
- [ ] Question counter shows progress (e.g., "Question 5 of ~12")
- [ ] Outline generation can be triggered from wizard
- [ ] Generated outline displays with chapters and key points
- [ ] Outline display shows when sections exist in database
- [ ] All existing tests pass (no regressions)
- [ ] New component tests cover key interactions

## Notes

Created: 2026-02-13
Team: Dev Team 2
