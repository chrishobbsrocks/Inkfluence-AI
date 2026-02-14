# Sprint 15: QA Scoring and Analysis Engine

## Overview

| Field | Value |
|-------|-------|
| Sprint | 15 |
| Title | QA Scoring and Analysis Engine |
| Epic | 7 - Quality Assurance Assistant |
| Status | Planning |
| Created | 2026-02-13 |
| Started | - |
| Completed | - |

## Goal

Build the AI-powered quality analysis engine that scores book content on readability, consistency, structure, and accuracy, and generates specific improvement suggestions.

## Background

Before publishing, users need confidence their content meets professional standards. The QA engine uses Claude to analyze the full book, score it on 4 dimensions, identify issues, and provide actionable suggestions. This is the backend engine — the UI is Sprint 16.

## Requirements

### Functional Requirements

- [ ] Overall quality score (0-100) for the book
- [ ] Per-chapter quality scores
- [ ] 4 scoring dimensions: Readability, Consistency, Structure, Accuracy
- [ ] Specific improvement suggestions with explanations
- [ ] Issue categorization (terminology, passive voice, missing examples, etc.)
- [ ] Severity levels for issues (high, medium, low)
- [ ] Auto-fixable issue flagging (e.g., terminology inconsistency, passive voice)
- [ ] API route to trigger analysis and retrieve results
- [ ] Results stored in database for persistence

### Non-Functional Requirements

- [ ] Full book analysis completes under 60 seconds
- [ ] Scoring is consistent (same content → similar score)
- [ ] Suggestions are specific and actionable (not vague)

## Dependencies

- **Sprints**: Sprint 6 (Claude API), Sprint 10 (chapter content)
- **External**: Anthropic API

## Scope

### In Scope

- QA analysis API route
- Scoring algorithm using Claude
- Per-chapter and overall scoring
- Suggestion generation
- Issue classification and severity
- Auto-fixable issue detection
- Results persistence

### Out of Scope

- QA dashboard UI (Sprint 16)
- Auto-fix execution (Sprint 16)
- Grammar checking (use Claude's native capability)

## Technical Approach

### Analysis Prompt
For each chapter, send to Claude:
```
Analyze this chapter for publishing quality. Score each dimension 0-100:
1. Readability: clarity, sentence structure, accessibility
2. Consistency: terminology, tone, formatting consistency
3. Structure: logical flow, transitions, paragraph organization
4. Accuracy: claims supported, no contradictions, factual statements

Provide specific suggestions in JSON:
{
  "scores": { "readability": N, "consistency": N, "structure": N, "accuracy": N },
  "suggestions": [
    { "type": "terminology|passive_voice|missing_example|...", "text": "...", "location": "...", "severity": "high|medium|low", "autoFixable": true|false, "fix": "..." }
  ]
}
```

### Scoring Aggregation
- Overall score = weighted average of 4 dimensions
- Book score = weighted average of chapter scores (by word count)

### Data Model
```
qa_analyses: id, book_id, overall_score, readability_score, consistency_score, structure_score, accuracy_score, created_at
qa_suggestions: id, analysis_id, chapter_id, type, text, location, severity, auto_fixable, fix_text, status (open|applied|dismissed)
```

## Tasks

### Phase 2: Implementation
- [ ] Add qa_analyses and qa_suggestions tables to schema
- [ ] Run database migration
- [ ] Design and test analysis prompt for quality scoring
- [ ] Create POST /api/qa/analyze route (triggers full book analysis)
- [ ] Create GET /api/qa/results/[bookId] route (get latest results)
- [ ] Implement per-chapter analysis (parallel API calls)
- [ ] Implement score aggregation
- [ ] Implement suggestion extraction and classification
- [ ] Store results in database
- [ ] Flag auto-fixable issues (terminology inconsistencies, passive voice)

## Acceptance Criteria

- [ ] Analysis produces scores for all 4 dimensions (0-100)
- [ ] Per-chapter scores are calculated
- [ ] Overall book score is weighted average
- [ ] Suggestions are specific with type, location, and severity
- [ ] Auto-fixable issues correctly identified
- [ ] Results persist in database
- [ ] Analysis completes under 60 seconds for 8-chapter book
- [ ] API returns structured JSON with scores and suggestions

## Notes

Run chapter analyses in parallel to speed up total analysis time.
