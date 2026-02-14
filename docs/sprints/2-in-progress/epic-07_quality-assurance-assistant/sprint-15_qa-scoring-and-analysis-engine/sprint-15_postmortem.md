# Sprint 15 Postmortem: QA Scoring and Analysis Engine

## Metrics

| Metric | Value |
|--------|-------|
| Sprint Number | 15 |
| Started | 2026-02-13 |
| Completed | 2026-02-13 |
| Duration | ~2 hours |
| Steps Completed | 13 |
| Files Changed | 14 new, 3 modified |
| Tests Added | 51 (17 prompt, 22 validation, 12 engine) |
| Total Tests | 534 passing |

## What Went Well

- Existing Claude tool_use pattern from Sprint 11 made QA engine design straightforward
- Per-chapter parallel analysis via Promise.all was clean to implement
- Word-count-weighted aggregation provides fair book-level scoring
- All 51 new tests passed on first run with zero failures
- Clean separation between engine (pure functions), prompts (templates), and API (orchestration)

## What Could Improve

- Could add streaming progress events so the UI can show per-chapter completion during analysis
- Consider caching recent analyses to avoid re-analyzing unchanged chapters

## Blockers Encountered

- None — clean implementation with no blockers

## Technical Insights

- Claude tool_use with `tool_choice: { type: "tool", name: "..." }` reliably produces structured JSON, eliminating the need for freeform text parsing
- Low temperature (0.2) is appropriate for scoring tasks where consistency matters more than creativity
- JSONB columns in Drizzle work well for complex nested data (chapterScores, suggestions) while keeping scalar scores as indexed integers for query performance
- Cross-chapter consistency check as a separate lightweight pass keeps per-chapter analysis independent and parallelizable

## Process Insights

- Backend-only sprints move faster when the API pattern is well-established
- The existing test patterns (prompt builder tests, Zod schema tests) provide a clear template for new features

## Patterns Discovered

```typescript
// Per-chapter parallel analysis with Promise.all
const chapterResults = await Promise.all(
  chaptersWithContent.map((ch) =>
    analyzeChapterQuality(ch, bookTopic, audience)
  )
);

// Word-count-weighted score aggregation
const totalWords = chapters.reduce((sum, ch) => sum + ch.wordCount, 0);
const weightedScore = Math.round(
  chapters.reduce((sum, ch) => sum + ch.score * ch.wordCount, 0) / totalWords
);

// Cross-chapter consistency adjustment (-20 to 0)
const finalConsistency = Math.max(0, aggregated.consistency + adjustment);
```

## Action Items for Next Sprint

- [ ] Sprint 16: Build QA Screen UI consuming the analysis API
- [ ] Sprint 16: Implement auto-fix actions using suggestions data
- [ ] Consider adding analysis caching for unchanged chapters

## Notes

- Commit: `739b549`
- Database schema uses db:push (no Drizzle migrations) per project convention
- API route follows established patterns from Sprint 11 (chapter generation)
