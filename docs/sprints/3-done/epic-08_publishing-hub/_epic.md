---
epic: 8
title: "Publishing Hub"
status: done
created: 2026-02-13
started: null
completed: 2026-02-13T19:57:39Z

total_hours: 0.3
---

# Epic 8: Publishing Hub

## Overview

The final mile — getting the book published. This epic covers the pre-publish checklist, automated metadata generation (keywords, categories, descriptions), platform-specific formatting, platform connection management, and the publishing workflow with status tracking. For MVP, we focus on export-ready formats with optimized metadata rather than direct API publishing to KDP/Apple Books.

## Success Criteria

- [ ] Pre-publish checklist with validation (chapters complete, QA passed, cover finalized, metadata complete)
- [ ] Auto-generated metadata: keywords, categories, description, pricing
- [ ] User can edit all auto-generated metadata
- [ ] Platform connection management UI (KDP, Apple Books, Google Play, Kobo)
- [ ] Format-specific export (KDP-ready PDF, Apple Books EPUB)
- [ ] Publishing status tracking per platform
- [ ] Publishing Hub UI matches wireframe

## MVP Scope Note

Direct API submission to publishing platforms (Amazon KDP, Apple Books, etc.) is deferred. These platforms don't provide public submission APIs. MVP focuses on:
1. Generating platform-optimized files
2. Auto-generating metadata
3. Providing platform-specific formatting guidelines
4. Tracking submission status manually

## Sprints

| Sprint | Title | Status |
|--------|-------|--------|
| 17 | Metadata and Pre-publish Workflow | planned |
| 18 | Platform Management and Publishing | planned |

## Notes

Created: 2026-02-13
Depends on: Epic 6 (Export Engine) and Epic 7 (QA must pass before publishing).
This is the capstone epic — completing it means the full Core Product is functional.
