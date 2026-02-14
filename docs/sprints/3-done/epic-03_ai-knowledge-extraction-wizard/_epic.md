---
epic: 3
title: "AI Knowledge Extraction Wizard"
status: done
created: 2026-02-13
started: null
completed: 2026-02-13T16:16:09Z

total_hours: 18.0
---

# Epic 3: AI Knowledge Extraction Wizard

## Overview

The core differentiator of Inkfluence AI. An interactive, interview-style tool that uses Claude AI to guide users through structured questions, extract their expertise, identify knowledge gaps, and automatically generate a coherent book outline. This is what sets us apart from Jasper, Sudowrite, and every other AI writing tool.

## Success Criteria

- [ ] Claude API integration with streaming responses working
- [ ] Conversational interview flow that adapts based on user responses
- [ ] Knowledge gap detection that prompts for missing information
- [ ] AI generates complete book outline with chapter titles and key points
- [ ] 5-step wizard flow: Topic → Audience → Expertise → Outline → Review
- [ ] Users can review and modify generated outline before proceeding
- [ ] Chat UI matches wireframe (AI messages, user messages, action buttons)

## Key Technical Challenges

- Prompt engineering for knowledge extraction (not generic content generation)
- Maintaining conversation context across multiple exchanges
- Streaming AI responses for responsive UX
- Structured outline generation from unstructured conversation

## Sprints

| Sprint | Title | Status |
|--------|-------|--------|
| 6 | Claude API Integration and Chat Engine | planned |
| 7 | Wizard UI and Outline Generation | planned |

## Notes

Created: 2026-02-13
Depends on: Epic 1 (Foundation), Epic 2 (Book Management — need a book to attach outline to).
This epic addresses the #1 pain point across all personas: organizing knowledge into book structure.
