---
sprint: 20
title: "Bug Fixes and Polish Pass"
type: fullstack
epic: null
status: in-progress
created: 2026-02-13T20:49:45Z
started: 2026-02-13T20:56:46Z
completed: null
hours: null
workflow_version: "3.1.0"


---

# Sprint 20: Bug Fixes and Polish Pass

## Overview

| Field | Value |
|-------|-------|
| Sprint | 20 |
| Title | Bug Fixes and Polish Pass |
| Type | fullstack |
| Epic | None |
| Status | Planning |
| Created | 2026-02-13 |
| Started | - |
| Completed | - |

## Goal

Fix critical pipeline bugs and UI inconsistencies identified during integration testing.

## Background

After completing Sprints 1-19, integration testing revealed several bugs in the Wizard → Outline → Editor pipeline, plus UI inconsistencies. This sprint captures those fixes and does a final polish pass.

## Requirements

### Functional Requirements

- [x] Fix wizard stepper phase mapping (gap_analysis and outline_generation mapped to wrong steps)
- [x] Add showingOutlinePreview prop so stepper shows Review step during outline preview
- [x] Mark AI-generated outline sections as aiSuggested: true
- [x] Wire "Continue to Writing" button to create chapters from outline sections
- [x] Add idempotency guard (skip if chapters already exist)
- [x] Add validation (at least 1 section required before converting)
- [x] Transition book status draft → writing when chapters are created
- [x] Fix wizard header logo color (text-stone-700 → text-stone-900)
- [ ] Systematic polish pass: verify UI consistency across all pages

### Non-Functional Requirements

- [ ] All 686+ tests passing
- [ ] Build clean with no errors

## Dependencies

- **Sprints**: All prior sprints (1-19)
- **External**: None

## Scope

### In Scope

- Pipeline bugs (wizard → outline → editor flow)
- UI consistency fixes (logo, stepper)
- Server action for outline sections → chapters conversion

### Out of Scope

- New features
- Performance optimization
- Database migrations

## Technical Approach

Direct bug fixes in existing files. Server action pattern for outline-to-chapters conversion matching existing codebase conventions.

## Tasks

### Phase 1: Planning
- [ ] Review requirements
- [ ] Design architecture
- [ ] Clarify requirements

### Phase 2: Implementation
- [ ] Write tests
- [ ] Implement feature
- [ ] Fix test failures

### Phase 3: Validation
- [ ] Quality review
- [ ] Refactoring

### Phase 4: Documentation
- [ ] Update docs

## Acceptance Criteria

- [ ] All tests passing
- [ ] Code reviewed

## Notes

Created: 2026-02-13
