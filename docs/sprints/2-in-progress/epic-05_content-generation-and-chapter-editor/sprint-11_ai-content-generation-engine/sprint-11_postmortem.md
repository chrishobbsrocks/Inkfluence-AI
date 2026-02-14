# Sprint 11 Postmortem: AI Content Generation Engine

## Metrics

| Metric | Value |
|--------|-------|
| Sprint Number | 11 |
| Started | 2026-02-13T16:43:57Z |
| Completed | 2026-02-13T17:15:00Z |
| Duration | ~0.5 hours |
| Steps Completed | 14 |
| Files Changed | 18 (12 new, 6 modified) |
| Tests Added | 35 (18 prompt + 11 validation + 6 hook) |
| Coverage Delta | 417 total tests passing (up from 382) |

## What Went Well

- Existing SSE streaming pattern from Sprint 6/7 (chat engine) provided a clear blueprint — content engine followed the same structure with minimal deviation
- Throttled streaming via `requestAnimationFrame` + 100ms threshold worked cleanly for smooth editor updates
- All 417 tests passed on first full run with zero failures
- Context gathering approach (previous chapters, conversation history, outline sections) was well-scoped with clear limits (200 chars, 6 exchanges)
- AiContentBlock Tiptap extension was straightforward — leveraged Tiptap's Node API cleanly

## What Could Improve

- Default tone/expertise are hardcoded ("professional"/"intermediate") — need Sprint 12 UI controls soon
- No integration tests for the API route (would need mocking Clerk auth + database)
- Could add word count progress indicator during streaming

## Blockers Encountered

- No blockers — implementation was smooth due to established patterns from earlier AI sprints

## Technical Insights

- `editor.commands.setContent(html, false)` — the second parameter `false` suppresses `onUpdate` events, critical for preventing auto-save triggers during streaming
- `requestAnimationFrame` combined with a timestamp threshold provides better throttling than `setInterval` for streaming content — it aligns with browser paint cycles
- SSE event format (`data: JSON\n\n`) works well for structured streaming with typed events (text, metadata, done, error)

## Process Insights

- Having established patterns (chat engine SSE, Zod validation, prompt builders) made this sprint very fast
- Test-first approach validated the hook's state machine transitions (idle → loading → streaming → complete) before wiring to the editor

## Patterns Discovered

```typescript
// Throttled streaming pattern for React hooks
const pendingContentRef = useRef("");
const lastUpdateRef = useRef(0);
const rafIdRef = useRef<number>(0);

function scheduleContentUpdate() {
  const now = performance.now();
  if (now - lastUpdateRef.current >= THROTTLE_MS) {
    lastUpdateRef.current = now;
    setStreamedContent(pendingContentRef.current);
  } else {
    cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = requestAnimationFrame(() => {
      lastUpdateRef.current = performance.now();
      setStreamedContent(pendingContentRef.current);
    });
  }
}
```

## Action Items for Next Sprint

- [ ] Sprint 12: Add AI Sidebar with tone/expertise controls
- [ ] Sprint 12: Add regeneration support for individual sections
- [ ] Consider adding word count progress indicator during generation

## Notes

- Content generation uses `GENERATION_MAX_TOKENS = 8192` and `GENERATION_TEMPERATURE = 0.7` — tuned for creative but structured chapter output
- The `responsePromise` pattern allows non-blocking auto-save: stream returns to client immediately while save happens asynchronously after completion
