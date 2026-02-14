# Sprint 16: QA UI and Auto Fix

## Overview

| Field | Value |
|-------|-------|
| Sprint | 16 |
| Title | QA UI and Auto Fix |
| Epic | 7 - Quality Assurance Assistant |
| Status | Planning |
| Created | 2026-02-13 |
| Started | - |
| Completed | - |

## Goal

Build the Quality Review dashboard UI and auto-fix functionality that lets users review scores, see suggestions, and fix issues with one click.

## Background

Sprint 15 built the analysis engine. This sprint creates the user-facing dashboard where users see their book's quality scores, review per-chapter results, browse suggestions, and apply auto-fixes for common issues.

## Requirements

### Functional Requirements

- [ ] Overall quality score circle (large, centered, 0-100)
- [ ] Quality label ("Professional Quality", "Needs Work", etc.)
- [ ] 4 dimension scores in a row (Readability, Consistency, Structure, Accuracy)
- [ ] Chapter scores table with score and suggestion count
- [ ] "View" button per chapter to see chapter-specific suggestions
- [ ] Top suggestions list with description and sub-text
- [ ] Auto-fix button for fixable issues
- [ ] "Fix All Issues" button for batch auto-fix
- [ ] "Re-run" button to re-analyze
- [ ] Checkbox per suggestion for batch operations

### Non-Functional Requirements

- [ ] Loading state during analysis
- [ ] Smooth animations for score display
- [ ] Auto-fix shows before/after preview

## Dependencies

- **Sprints**: Sprint 15 (QA engine and API)
- **External**: None

## Scope

### In Scope

- QA dashboard page at /books/[bookId]/qa
- Score visualization components
- Suggestion list components
- Auto-fix execution
- Batch fix capability
- Re-run analysis

### Out of Scope

- Custom scoring rules
- Integration with external grammar tools

## Technical Approach

### Reference: Wireframe QAScreen (lines 733-803)

### Auto-Fix Implementation
For each auto-fixable issue:
1. Read the fix suggestion from the QA analysis
2. Apply the fix to chapter content (find and replace)
3. Mark suggestion as "applied"
4. Update chapter content in database
5. Show success indicator

### Score Labels
- 90-100: "Exceptional Quality"
- 80-89: "Professional Quality"
- 70-79: "Good Quality"
- 60-69: "Needs Improvement"
- Below 60: "Significant Revision Needed"

## Tasks

### Phase 2: Implementation
- [ ] Create QA page at /books/[bookId]/qa
- [ ] Create OverallScore component (circle with score, label)
- [ ] Create DimensionScores component (4 scores in a row)
- [ ] Create ChapterScores component (table with scores and suggestion counts)
- [ ] Create SuggestionsList component (text, sub-text, action button)
- [ ] Create AutoFixButton component (applies fix to chapter content)
- [ ] Implement "Fix All Issues" batch operation
- [ ] Implement "Re-run" analysis trigger
- [ ] Wire up data from QA analysis API
- [ ] Add loading state during analysis
- [ ] Show before/after for auto-fix previews

## Acceptance Criteria

- [ ] QA dashboard shows overall score in circle per wireframe
- [ ] 4 dimension scores display correctly
- [ ] Chapter scores table lists all chapters with scores
- [ ] Suggestions list shows specific issues with auto-fix buttons
- [ ] Auto-fix applies correction to chapter content
- [ ] "Fix All Issues" applies all auto-fixable suggestions
- [ ] "Re-run" triggers new analysis and updates scores
- [ ] UI matches wireframe QAScreen (lines 733-803)

## Notes

Wireframe reference: QAScreen lines 733-803.
