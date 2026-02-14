---
sprint: 22
title: "Production Hardening"
epic: null
status: in-progress
created: 2026-02-13T21:17:12Z
started: 2026-02-13T21:17:12Z
completed: null
hours: null
workflow_version: "3.5.0"

---

# Sprint 22: Production Hardening

## Overview

| Field | Value |
|-------|-------|
| Sprint | 22 |
| Title | Production Hardening |
| Epic | None (standalone) |
| Status | Planning |
| Created | 2026-02-13 |
| Started | - |
| Completed | - |

## Goal

Add rate limiting to AI endpoints, security headers, fix broken user flows (partial export, wizard re-run, QA fix conflicts), and prevent silent data loss on streamed content saves.

## Background

The core product works end-to-end but lacks production safeguards. Any user can fire unlimited Claude API calls (financial risk), there are no HTTP security headers, some user flows hit dead ends, and streamed AI content can be silently lost if the database save fails after generation.

Note: AI fingerprint removal and server action error handling were found to already be implemented (HUMAN_VOICE_RULES in constants.ts, ActionResult pattern in server actions). This sprint focuses on the remaining gaps.

## Requirements

### Priority 1: AI Rate Limiting & Cost Controls

- [ ] **Per-user rate limiting on AI endpoints**: Add rate limiting to prevent runaway API costs:
  - `src/app/api/ai/generate/chapter/route.ts` — limit to 10 generations per hour per user
  - `src/app/api/ai/chat/route.ts` — limit to 50 messages per hour per user
  - Store rate limit counters in database (new `rateLimits` table) or use in-memory with Vercel KV
  - Return 429 Too Many Requests with clear error message and retry-after header
  - Show user-friendly message in UI when rate limited

- [ ] **Conversation history truncation**: The chat engine sends full conversation history on each request. Add a token budget:
  - Implement token counting utility (approximate: 1 token ≈ 4 chars)
  - Truncate/summarize conversation history when it exceeds 8,000 tokens
  - Keep system prompt + last N messages that fit within budget
  - File: `src/lib/ai/chat-engine.ts`

### Priority 2: Fix Broken User Flows

- [ ] **Can't re-run Knowledge Wizard**: Once outline sections exist, the wizard is hidden with no way to regenerate:
  - File: `src/app/(app)/books/[bookId]/outline/page.tsx` (line ~44)
  - Add a "Regenerate Outline" button/option that allows re-running the wizard
  - Warn user that regenerating will replace existing outline sections
  - Preserve existing chapters if they've been created (don't delete work)

- [ ] **Can't export partial books**: EPUB/PDF export fails if ANY chapter is empty:
  - Files: `src/app/api/export/epub/route.ts` (line ~52-58), `src/app/api/export/pdf/route.ts`
  - Filter out empty chapters (content is null or empty string)
  - Allow export if at least 1 chapter has content
  - Show warning in UI: "X of Y chapters included (Z chapters have no content yet)"

- [ ] **QA fix breaks on edited content**: Returns 409 if chapter was modified after QA analysis:
  - File: `src/app/api/qa/fix/route.ts` (line ~88-103)
  - Instead of exact text matching, use fuzzy matching or re-analyze the specific issue
  - If original text not found, return helpful error: "Chapter content has changed since analysis. Please re-run QA."
  - Add a "Re-analyze" button in the QA UI for this scenario

### Priority 3: Silent Data Loss Prevention

- [ ] **Confirm save success for streamed AI content**: When Claude streams content, the save is fire-and-forget:
  - Files: `src/lib/ai/content-engine.ts` (line ~127-137), `src/app/api/ai/chat/route.ts` (line ~70-82)
  - After streaming completes, send a final SSE event confirming save status: `{type: "save_status", success: true/false}`
  - Add retry logic with exponential backoff on save failure (up to 3 attempts)
  - Client-side: show warning toast if save fails ("Content not saved — click to retry")
  - Do NOT block the stream — save confirmation happens as a follow-up event

### Priority 4: Security Headers

- [ ] **Add HTTP security headers** in `next.config.ts`:
  ```
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.clerk.com https://*.neon.tech https://api.anthropic.com
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  ```
  - Test that Clerk auth, AI generation, and all external APIs still work after CSP is applied
  - Iterate on CSP if anything breaks

## Dependencies

- **Sprints**: Sprint 20-21 complete
- **External**: None (unless using Vercel KV for rate limiting)

## Scope

### In Scope

- Rate limiting on AI endpoints
- Conversation history truncation
- Broken flow fixes (wizard re-run, partial export, QA fix conflict)
- Save confirmation for streamed content
- HTTP security headers

### Out of Scope

- Database row-level security (RLS) — separate sprint, requires Neon configuration
- Payment/billing integration
- Full audit logging
- Performance optimization
- New features

## Technical Approach

### Rate Limiting

Option A (Recommended for MVP): Database-backed rate limiting
- New `rateLimits` table: `userId`, `endpoint`, `count`, `windowStart`
- Check on each request, increment counter, reset window after 1 hour
- Simple, no external dependencies

Option B: Vercel KV (Redis)
- Faster but adds infrastructure dependency
- Better for high traffic but overkill for MVP

### Token Counting

Approximate counting is sufficient for MVP:
```typescript
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
```

### Save Confirmation

Extend the existing SSE protocol with a new event type:
```
event: save_status
data: {"success": true, "chapterId": "..."}
```

Client listens for this after stream ends.

## Tasks

### Team 2 (AI & Backend)
- [ ] Design and create rate limiting table/utility
- [ ] Add rate limiting middleware to AI generate endpoint
- [ ] Add rate limiting middleware to AI chat endpoint
- [ ] Implement token counting and conversation truncation
- [ ] Add save confirmation SSE events to content engine
- [ ] Add retry logic for failed saves
- [ ] Fix partial export (filter empty chapters)
- [ ] Fix QA fix conflict (fuzzy matching or re-analyze prompt)
- [ ] Add "Regenerate Outline" option to outline page
- [ ] Configure security headers in next.config.ts
- [ ] Test CSP doesn't break Clerk, AI, or external APIs

### Verification
- [ ] Rate limit triggers after threshold (test with rapid requests)
- [ ] Long conversations don't send excessive tokens
- [ ] Save failure shows user warning
- [ ] Partial book exports successfully
- [ ] QA fix works on edited chapters
- [ ] Wizard can be re-run
- [ ] Security headers present in response (check via browser devtools)
- [ ] All existing functionality still works (no CSP regressions)
- [ ] Vercel build passes clean

## Acceptance Criteria

- [ ] AI endpoints return 429 after rate limit exceeded
- [ ] Chat conversations truncated to token budget before sending to Claude
- [ ] Streamed content save failures show user warning with retry option
- [ ] Partial books can be exported (empty chapters skipped)
- [ ] QA fix handles edited chapters gracefully
- [ ] Knowledge Wizard can be re-run for existing books
- [ ] Security headers present on all responses
- [ ] No regressions in existing functionality
- [ ] Build passes clean on Vercel

## Notes

This is primarily a Dev Team 2 sprint (AI & backend domain). The security headers and some flow fixes may overlap with Team 1 territory — coordinate if needed.

Already implemented (no action needed):
- AI fingerprint removal (HUMAN_VOICE_RULES in src/lib/ai/prompts/constants.ts)
- Server action error handling (ActionResult pattern throughout)
- API route try-catch blocks (already present in all routes)
