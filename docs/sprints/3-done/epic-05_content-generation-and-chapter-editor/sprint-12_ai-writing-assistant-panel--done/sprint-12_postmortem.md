# Sprint 12 Postmortem: AI Writing Assistant Panel

## Metrics

| Metric | Value |
|--------|-------|
| Sprint Number | 12 |
| Started | 2026-02-13T17:10:42Z |
| Completed | 2026-02-13T18:00:00Z |
| Duration | ~0.8 hours |
| Steps Completed | 13 |
| Files Changed | 17 (9 new, 7 modified, 1 deleted) |
| Tests Added | 23 (9 hook + 14 panel component) |
| Coverage Delta | 475 total tests passing (up from 417) |

## What Went Well

- Component decomposition (4 sub-components + panel container) kept each file focused and testable
- Wireframe had exact CSS classes (w-64, text-[10px], h-6) — implementation matched pixel-perfectly
- `useAiPanelState` hook cleanly encapsulates all panel logic (tone, expertise, sections, progress)
- NodeView pattern for AI content block actions worked well with extension storage for callbacks
- ResizeObserver mock fix (class instead of arrow function) resolved a long-standing flaky test

## What Could Improve

- Section tracking via simple counter is a UX compromise — future sprint should detect actual content coverage
- No persistence of tone/expertise preferences across sessions
- Could add keyboard shortcuts for generate (e.g., Cmd+Shift+G)

## Blockers Encountered

- ResizeObserver mock using `vi.fn().mockImplementation()` caused `not a constructor` error when Radix UI tried `new ResizeObserver()`. Fixed by switching to a proper class definition.

## Technical Insights

- Tiptap's `editor.storage` is the correct way to pass React callbacks into NodeView components — avoids React Context crossing ProseMirror boundaries
- `ReactNodeViewRenderer` requires importing from `@tiptap/react`, not `@tiptap/core`
- `NodeViewContent` renders an editable content hole inside the React NodeView wrapper, preserving editability
- `addStorage()` in Tiptap extensions returns the initial storage object; it's then mutable via `editor.storage[extensionName]`

## Process Insights

- Building on Sprint 11's generation hook meant the panel was purely additive — no generation logic changes needed
- Sub-component pattern (`ai-panel/` directory) prevented the main `editor/` directory from becoming cluttered
- Removing the toolbar AI button simplified the UX by having a single generation entry point

## Patterns Discovered

```typescript
// Tiptap extension storage for React callbacks in NodeView
addStorage() {
  return {
    onRegenerate: undefined as (() => void) | undefined,
  };
},

// Set from React wrapper
useEffect(() => {
  if (editor) {
    editor.storage.aiContentBlock.onRegenerate = () => {
      generation.generate(panelState.tone, panelState.expertise);
    };
  }
}, [editor, generation, panelState.tone, panelState.expertise]);

// Access from NodeView component
editor.storage.aiContentBlock?.onRegenerate?.();
```

## Action Items for Next Sprint

- [ ] Sprint 15: QA Engine may need to assess generated content quality
- [ ] Consider persisting tone/expertise in user preferences
- [ ] Consider section-by-section generation instead of full chapter

## Notes

- Epic 5 is now complete (Sprints 10, 11, 12 all done)
- The AI Writing Assistant panel completes the chapter editor experience: write, generate, control, manage
