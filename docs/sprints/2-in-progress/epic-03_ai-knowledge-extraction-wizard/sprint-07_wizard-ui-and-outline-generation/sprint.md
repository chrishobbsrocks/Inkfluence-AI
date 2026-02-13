# Sprint 7: Wizard UI and Outline Generation

## Overview

| Field | Value |
|-------|-------|
| Sprint | 7 |
| Title | Wizard UI and Outline Generation |
| Epic | 3 - AI Knowledge Extraction Wizard |
| Status | Planning |
| Created | 2026-02-13 |
| Started | - |
| Completed | - |

## Goal

Build the Knowledge Extraction Wizard UI with the 5-step flow, chat interface, and AI-powered outline generation from the conversation.

## Background

After Sprint 6 built the chat engine, this sprint creates the user-facing wizard experience. Users step through Topic → Audience → Expertise → Outline → Review, chatting with the AI interviewer along the way. The AI then generates a structured book outline from the conversation.

## Requirements

### Functional Requirements

- [ ] 5-step wizard stepper: Topic, Audience, Expertise, Outline, Review
- [ ] Chat interface with AI and user message bubbles
- [ ] AI messages: bg-white, border border-stone-200, rounded-xl rounded-tl-sm
- [ ] User messages: bg-stone-100, rounded-xl rounded-tr-sm
- [ ] AI avatar: w-7 h-7, rounded-full, bg-stone-900 with Sparkles icon
- [ ] User avatar: w-7 h-7, rounded-full, bg-stone-200 with initial
- [ ] Text input with Send button
- [ ] Record button (placeholder — not functional in MVP)
- [ ] "Upload notes" button (placeholder)
- [ ] Question counter ("Question 6 of ~12")
- [ ] "Yes, add it" / "Skip for now" action buttons for gap suggestions
- [ ] "Save & Exit" button to save progress
- [ ] AI generates complete outline at end of interview
- [ ] Outline shows chapter titles with key points
- [ ] User can accept, modify, or regenerate the outline
- [ ] Accepted outline saves to database and navigates to Outline Editor

### Non-Functional Requirements

- [ ] Streaming text appears word-by-word in chat
- [ ] Smooth scrolling as new messages appear
- [ ] Responsive layout (max-w-xl centered)

## Dependencies

- **Sprints**: Sprint 6 (Claude API and chat engine)
- **External**: None

## Scope

### In Scope

- Full wizard UI per wireframe
- Chat message components (AI and user)
- Step indicator/stepper
- Outline generation from conversation
- Outline review and editing
- Save & resume wizard state

### Out of Scope

- Voice recording functionality
- File upload processing
- Advanced outline editing (Sprint 8)

## Technical Approach

### Reference: Wireframe WizardScreen (lines 193-257) and ChatMsg (lines 260-276)

### Outline Generation
At the end of the interview (~10-12 questions), call Claude with the full conversation and a specific prompt to generate a structured outline:
```json
{
  "chapters": [
    {
      "title": "Chapter Title",
      "key_points": ["Point 1", "Point 2"],
      "estimated_words": 2500,
      "ai_suggested": false
    }
  ]
}
```

### State Management
- Wizard phase tracked in URL query param or local state
- Conversation synced with database via Sprint 6 infrastructure
- Outline generation is a server action that calls Claude with conversation context

## Tasks

### Phase 1: Planning
- [ ] Map wireframe to component hierarchy
- [ ] Design outline generation prompt

### Phase 2: Implementation
- [ ] Create StepIndicator component (5 steps with completion state)
- [ ] Create ChatMessage component (AI and user variants)
- [ ] Create ChatInput component (text input + send + record + upload)
- [ ] Create WizardPage layout (header with stepper, chat area, input)
- [ ] Implement streaming message display (word-by-word)
- [ ] Implement auto-scroll on new messages
- [ ] Create QuestionCounter component
- [ ] Create GapSuggestion component (Yes, add it / Skip buttons)
- [ ] Implement wizard phase transitions (auto-detect from AI responses)
- [ ] Build outline generation function (conversation → structured outline)
- [ ] Create OutlineReview component (display generated outline, edit, accept)
- [ ] Wire up save & exit functionality
- [ ] Wire up navigation to Outline Editor on acceptance

### Phase 3: Validation
- [ ] Full wizard flow works: topic → questions → outline → review
- [ ] Streaming messages render smoothly
- [ ] Outline generation produces valid chapter structure
- [ ] Can save and resume wizard progress
- [ ] Accepted outline creates chapters in database

## Acceptance Criteria

- [ ] Wizard UI matches wireframe design (WizardScreen, lines 193-257)
- [ ] 5-step stepper shows progress through wizard
- [ ] Chat messages display with correct styling (AI vs. user)
- [ ] Streaming text appears incrementally
- [ ] AI asks ~10-12 questions before generating outline
- [ ] Gap detection shows suggestion with action buttons
- [ ] Generated outline has chapters with titles and key points
- [ ] User can review, edit, and accept outline
- [ ] Accepted outline saves to database with chapters
- [ ] Navigates to Outline Editor after acceptance
- [ ] Save & Exit preserves conversation state

## Notes

Reference: WizardScreen (lines 193-257) and ChatMsg (lines 260-276) in wireframe file.
The wizard should feel conversational and guided, not like filling out a form.
