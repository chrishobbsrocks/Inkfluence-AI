# Sprint 11: AI Content Generation Engine

## Overview

| Field | Value |
|-------|-------|
| Sprint | 11 |
| Title | AI Content Generation Engine |
| Epic | 5 - Content Generation and Chapter Editor |
| Status | Planning |
| Created | 2026-02-13 |
| Started | - |
| Completed | - |

## Goal

Build the AI engine that generates 2000-3000 word chapters from outline points, with streaming output, tone controls, and expertise level adjustment.

## Background

This is the core value proposition — transforming outline bullet points into full, professional chapters in minutes. The engine takes a chapter's key points, the user's conversation context from the Knowledge Wizard, and tone/expertise preferences to generate coherent, high-quality content.

## Requirements

### Functional Requirements

- [ ] Generate full chapter (2000-3000 words) from outline key points
- [ ] Streaming output — text appears incrementally in the editor
- [ ] Tone control: Professional, Conversational, Academic
- [ ] Expertise level: Beginner, Intermediate, Expert
- [ ] Section-by-section generation (generate one section at a time)
- [ ] Full chapter generation (generate entire chapter at once)
- [ ] Regenerate section with different approach
- [ ] Context awareness — uses wizard conversation for voice/knowledge
- [ ] "AI Generate" button in editor toolbar
- [ ] "Generate Next Section" button

### Non-Functional Requirements

- [ ] Chapter generation completes within 2 minutes
- [ ] Streaming starts within 2 seconds of request
- [ ] Generated content is coherent and well-structured
- [ ] Handles API errors gracefully (retry, fallback)
- [ ] Token usage tracking for cost management

## Dependencies

- **Sprints**: Sprint 6 (Claude API infrastructure), Sprint 10 (Tiptap editor)
- **External**: Anthropic API

## Scope

### In Scope

- Chapter generation API route
- Section generation API route
- Prompt engineering for content generation
- Streaming integration with Tiptap editor
- Tone and expertise controls
- Regeneration capability
- Context injection from wizard conversation

### Out of Scope

- AI writing assistant panel UI (Sprint 12)
- Accept/reject UI (Sprint 12)
- Quality scoring (Epic 7)

## Technical Approach

### Prompt Strategy
```
System: You are a professional book author. Write content that matches
the user's expertise level ({beginner|intermediate|expert}) in a
{professional|conversational|academic} tone.

Context: Here is the author's knowledge from their interview:
{wizard_conversation_summary}

Task: Write the section "{section_title}" for chapter "{chapter_title}".
Cover these key points: {key_points}
Target word count: {target_words}
```

### API Routes
- POST /api/generate/chapter — Generate full chapter (streaming)
- POST /api/generate/section — Generate single section (streaming)

### Streaming to Editor
- API returns SSE stream
- Client receives chunks and inserts into Tiptap editor
- AI-generated content wrapped in a custom node type for identification

### AI Content Blocks
Generated content is inserted as a special Tiptap node that:
- Shows amber left border (AI-generated indicator)
- Has accept/reject/regenerate actions (built in Sprint 12)
- Converts to regular content when accepted

## Tasks

### Phase 2: Implementation
- [ ] Design and test chapter generation prompts
- [ ] Design and test section generation prompts
- [ ] Create POST /api/generate/chapter route with streaming
- [ ] Create POST /api/generate/section route with streaming
- [ ] Implement tone parameter in prompts
- [ ] Implement expertise level parameter in prompts
- [ ] Inject wizard conversation context into prompts
- [ ] Create custom Tiptap node for AI-generated content blocks
- [ ] Implement streaming content insertion into Tiptap
- [ ] Add "AI Generate" button to editor toolbar
- [ ] Add regeneration endpoint
- [ ] Add token usage tracking
- [ ] Handle errors and timeouts gracefully

## Acceptance Criteria

- [ ] Full chapter generation produces 2000-3000 coherent words
- [ ] Section generation produces content for individual sections
- [ ] Streaming output appears incrementally in editor
- [ ] Tone controls affect writing style (Professional vs. Conversational vs. Academic)
- [ ] Expertise level affects depth and complexity of content
- [ ] Generated content references user's expertise from wizard conversation
- [ ] Can regenerate a section with different approach
- [ ] Generation completes within 2 minutes
- [ ] AI content blocks visually distinct (amber border per wireframe)
- [ ] API errors show user-friendly messages

## Notes

Use Claude claude-sonnet-4-5-20250929 for content generation (good balance of quality and speed for long-form).
Token costs: ~3K tokens input + ~4K tokens output per section = ~$0.02/section. Full 8-chapter book ≈ $0.50-$1.00.
