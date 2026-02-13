---
epic: 7
title: "Quality Assurance Assistant"
status: planning
created: 2026-02-13
started: null
completed: null
---

# Epic 7: Quality Assurance Assistant

## Overview

AI-powered editing and quality scoring system that reviews generated content for readability, consistency, structure, and accuracy. Provides a quality score for each chapter and the overall book, specific improvement suggestions, and auto-fix capabilities for common issues like inconsistent terminology and passive voice.

## Success Criteria

- [ ] AI review analyzing 4 dimensions: readability, consistency, structure, accuracy
- [ ] Overall quality score (0-100) for the book
- [ ] Per-chapter quality scores
- [ ] Specific improvement suggestions with explanations
- [ ] Auto-fix for terminology inconsistencies
- [ ] Auto-fix for passive voice conversion
- [ ] Re-run analysis capability
- [ ] "Fix All Issues" batch operation
- [ ] QA dashboard UI matches wireframe

## Sprints

| Sprint | Title | Status |
|--------|-------|--------|
| 15 | QA Scoring and Analysis Engine | planned |
| 16 | QA UI and Auto Fix | planned |

## Notes

Created: 2026-02-13
Depends on: Epic 5 (needs generated content to analyze).
Can run in parallel with Epic 6 (Preview/Export) since both depend on Epic 5 but not each other.
