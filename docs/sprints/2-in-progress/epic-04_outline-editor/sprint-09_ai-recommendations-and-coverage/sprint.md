# Sprint 9: AI Recommendations and Coverage

## Overview

| Field | Value |
|-------|-------|
| Sprint | 9 |
| Title | AI Recommendations and Coverage |
| Epic | 4 - Outline Editor |
| Status | Planning |
| Created | 2026-02-13 |
| Started | - |
| Completed | - |

## Goal

Build the AI Recommendations panel for the Outline Editor that provides coverage analysis, suggested chapter additions, and gap detection.

## Background

While users edit their outline in Sprint 8, the AI panel on the right provides intelligent suggestions. It analyzes the current outline structure, identifies well-covered topics vs. gaps, and suggests new chapters or sections. This uses Claude to analyze the outline and provide structured recommendations.

## Requirements

### Functional Requirements

- [ ] AI Recommendations card on right side of outline editor (280px width)
- [ ] "Suggested additions" section with chapter suggestions
- [ ] Each suggestion: title, description, Add/Dismiss buttons
- [ ] "Coverage analysis" section showing well-covered vs. gap topics
- [ ] Well-covered topics with checkmarks
- [ ] Potential gaps with warning indicators
- [ ] Clicking "Add" creates the suggested chapter in the outline
- [ ] "Dismiss" hides the suggestion
- [ ] Recommendations refresh when outline changes significantly

### Non-Functional Requirements

- [ ] Recommendations generated asynchronously (don't block outline editing)
- [ ] Loading state while AI generates recommendations
- [ ] Cache recommendations to avoid redundant API calls

## Dependencies

- **Sprints**: Sprint 8 (outline editor UI), Sprint 6 (Claude API)
- **External**: None

## Scope

### In Scope

- AI Recommendations panel component
- Claude API call for outline analysis
- Coverage analysis display
- Suggested additions with add/dismiss
- Integration with outline editor

### Out of Scope

- Manual recommendation requests (auto-generated only)
- Detailed content suggestions (just structural)

## Technical Approach

### Reference: Wireframe OutlineScreen lines 332-359 (AI Recommendations card)

### AI Analysis Prompt
Send current outline to Claude with prompt:
"Analyze this book outline. Identify: 1) Topics well covered 2) Potential gaps 3) Suggested additional chapters with rationale"

Response format:
```json
{
  "wellCovered": ["Retention strategy", "churn diagnosis"],
  "gaps": ["Competitive positioning", "team alignment"],
  "suggestions": [
    { "title": "Case Studies", "reason": "Add real-world examples", "keyPoints": [] },
    { "title": "Action Plan", "reason": "Readers value actionable takeaways", "keyPoints": [] }
  ]
}
```

### Trigger Logic
- Generate recommendations on outline load
- Regenerate when chapters are added/removed (debounced 3s)
- Cache results until outline changes

## Tasks

### Phase 2: Implementation
- [ ] Create RecommendationsPanel component
- [ ] Create SuggestedAddition component (title, description, add/dismiss)
- [ ] Create CoverageAnalysis component (well-covered + gaps)
- [ ] Build AI analysis API route (POST /api/outline/analyze)
- [ ] Design and test analysis prompt
- [ ] Implement add-suggestion handler (creates chapter in outline)
- [ ] Implement dismiss handler
- [ ] Add loading/empty states
- [ ] Integrate panel into outline editor layout
- [ ] Add debounced re-analysis on outline changes

## Acceptance Criteria

- [ ] Recommendations panel displays on right side of outline editor
- [ ] AI generates coverage analysis showing well-covered topics
- [ ] AI identifies potential gaps in outline
- [ ] Suggested chapters show with Add/Dismiss buttons
- [ ] Clicking "Add" creates chapter in outline
- [ ] Clicking "Dismiss" removes suggestion
- [ ] Panel shows loading state during analysis
- [ ] UI matches wireframe AI Recommendations card (lines 332-359)

## Notes

Wireframe reference: The right-side Card in OutlineScreen, lines 332-359.
