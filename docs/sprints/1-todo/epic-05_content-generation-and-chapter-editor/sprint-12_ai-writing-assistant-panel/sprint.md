# Sprint 12: AI Writing Assistant Panel

## Overview

| Field | Value |
|-------|-------|
| Sprint | 12 |
| Title | AI Writing Assistant Panel |
| Epic | 5 - Content Generation and Chapter Editor |
| Status | Planning |
| Created | 2026-02-13 |
| Started | - |
| Completed | - |

## Goal

Build the AI Writing Assistant sidebar panel with tone/expertise controls, chapter progress tracking, section checklist, and accept/reject/regenerate actions for AI-generated content.

## Background

The right sidebar of the chapter editor provides AI controls and progress tracking. Users can set tone and expertise level, see chapter progress (word count vs. target), track which sections are complete, and manage AI-generated content blocks with accept/reject/regenerate actions.

## Requirements

### Functional Requirements

- [ ] Right sidebar panel (w-64, bg-stone-50)
- [ ] "AI Writing Assistant" title
- [ ] Tone selector: Professional, Conversational, Academic (toggle buttons)
- [ ] Expertise level: Beginner, Intermediate, Expert (toggle buttons)
- [ ] Chapter progress bar with word count vs. target
- [ ] Section checklist (done/active/pending indicators)
- [ ] "Generate Next Section" button at bottom
- [ ] Accept button on AI-generated content blocks
- [ ] Regenerate button with RefreshCw icon
- [ ] "Edit tone" button on AI blocks
- [ ] Discard button on AI blocks
- [ ] Accepted content converts to normal editor text
- [ ] Discarded content is removed from editor

### Non-Functional Requirements

- [ ] Panel state persists across page refreshes
- [ ] Progress updates in real-time as user types
- [ ] Smooth transitions when accepting/rejecting content

## Dependencies

- **Sprints**: Sprint 10 (editor), Sprint 11 (AI generation engine)
- **External**: None

## Scope

### In Scope

- AI Writing Assistant sidebar
- Tone and expertise controls wired to generation engine
- Chapter progress tracking
- Section checklist
- AI content block actions (accept/reject/regenerate/edit tone)
- Generate Next Section button

### Out of Scope

- New AI features beyond what's in wireframe
- Chat-with-AI in editor (not in wireframe)

## Technical Approach

### Reference: Wireframe EditorScreen right panel (lines 426-468)

### AI Content Block Actions
When user clicks Accept on an AI block:
1. Remove the amber border/indicator styling
2. Convert AI node to standard content nodes
3. Update chapter word count
4. Mark section as complete in progress tracker

When user clicks Regenerate:
1. Show loading state on the block
2. Call section generation API with same parameters
3. Replace block content with new generation

When user clicks Discard:
1. Remove the AI block from editor
2. Leave a placeholder ("Section: X — click Generate to expand")

### Progress Tracking
- Calculate word count from Tiptap character count extension
- Target words from outline data
- Section completion tracked from chapter outline sections

## Tasks

### Phase 2: Implementation
- [ ] Create AIAssistantPanel component
- [ ] Create ToneSelector component (3 toggle buttons)
- [ ] Create ExpertiseSelector component (3 toggle buttons)
- [ ] Create ChapterProgress component (progress bar + word count)
- [ ] Create SectionChecklist component (done/active/pending)
- [ ] Create GenerateButton component ("Generate Next Section")
- [ ] Implement AI content block action bar (accept/regenerate/edit tone/discard)
- [ ] Wire tone/expertise selections to generation API
- [ ] Implement accept action (convert AI block to normal content)
- [ ] Implement regenerate action (call API, replace content)
- [ ] Implement discard action (remove block, show placeholder)
- [ ] Real-time word count tracking
- [ ] Section progress tracking from editor state

## Acceptance Criteria

- [ ] AI Writing Assistant panel matches wireframe (lines 426-468)
- [ ] Tone selector shows 3 options, selected highlighted with bg-stone-900
- [ ] Expertise selector shows 3 options, selected highlighted
- [ ] Progress bar shows current words / target words
- [ ] Section checklist shows done (checkmark), active (chevron), pending (empty circle)
- [ ] "Generate Next Section" button triggers section generation
- [ ] Accept converts AI block to normal text
- [ ] Regenerate replaces AI block with new content
- [ ] Discard removes AI block and shows placeholder
- [ ] Word count updates in real-time as user types or accepts content

## Notes

Wireframe reference: EditorScreen right sidebar, lines 426-468.
The AI-generated content block styling (amber border) is defined in lines 406-418 of the wireframe.
