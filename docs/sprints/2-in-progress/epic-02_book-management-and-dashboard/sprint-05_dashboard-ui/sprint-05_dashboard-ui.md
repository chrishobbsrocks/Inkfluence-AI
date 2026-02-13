---
sprint: 5
title: "Dashboard UI"
type: fullstack
epic: 2
status: done
created: 2026-02-13T13:13:28Z
started: 2026-02-13T15:02:10Z
completed: 2026-02-13T15:12:00Z
hours: 0.2
workflow_version: "3.1.0"

---

# Sprint 5: Dashboard UI

## Overview

| Field | Value |
|-------|-------|
| Sprint | 5 |
| Title | Dashboard UI |
| Type | fullstack |
| Epic | 2 |
| Status | Done |
| Created | 2026-02-13 |
| Started | 2026-02-13 |
| Completed | 2026-02-13 |

## Goal

Build the My Books dashboard screen with stats cards, book grid, create dialog, and loading states using the data layer from Sprint 4.

## Background

The dashboard is the user's home base after signing in. It shows aggregate statistics, a responsive grid of book cards with status badges and progress bars, and a create-new-book flow. This is the first screen with real data-driven UI.

## Requirements

### Functional Requirements

- [x] Stats row: Total Books, Published, In Progress, Downloads (4 cards)
- [x] Book grid with responsive layout (3 cols desktop, 2 tablet, 1 mobile)
- [x] Book card: title, chapter info, word count, status badge, date, progress bar
- [x] "Create New Book" card with dashed border and plus icon
- [x] New Book button in header
- [x] Filter button in header (noop placeholder)
- [x] Status badges: Published (bg-stone-900), Writing/Draft/Review (secondary)
- [x] Progress bars for in-progress books
- [x] Clicking a book navigates to /books/[bookId]/outline
- [x] New book creation dialog (title + description)
- [x] Navigate to outline after book creation

### Non-Functional Requirements

- [x] Loading skeleton while data fetches (streaming via loading.tsx)
- [x] Empty state when no books exist
- [x] Server-side data fetching with auth protection

## Dependencies

- **Sprints**: Sprint 3 (app shell), Sprint 4 (book data layer)
- **External**: None

## Scope

### In Scope

- Dashboard page as async Server Component
- Stats cards, book card, book grid, create book card
- Create book dialog with form
- Empty state and loading skeleton
- 7 shadcn/ui component installations

### Out of Scope

- Advanced filtering UI (filter button is a noop)
- Downloads tracking (hardcoded 0)
- Book templates

## Technical Approach

- Dashboard page (`page.tsx`) is an async Server Component calling `auth()` -> `getUserByClerkId` -> `getBooks` + `getBookStats`
- Data passed as props to `DashboardContent` (client component orchestrator)
- Dialog state lifted to `DashboardContent`, shared between header button and CreateBookCard
- `CreateBookDialog` calls `createBookAction` server action, then navigates to `/books/[bookId]/outline`
- `loading.tsx` provides streaming skeleton fallback

## Tasks

### Phase 1: Planning
- [x] Review wireframe specs
- [x] Design component tree and data flow
- [x] Clarify post-creation navigation (navigate to outline)

### Phase 2: Implementation
- [x] Install shadcn components (card, badge, progress, dialog, input, label, skeleton)
- [x] Create StatsCards component
- [x] Create BookCard component with status badges and progress
- [x] Create CreateBookCard component
- [x] Create BookGrid component
- [x] Create CreateBookDialog component
- [x] Create DashboardContent orchestrator
- [x] Create DashboardEmptyState component
- [x] Create DashboardSkeleton + loading.tsx
- [x] Wire up dashboard page with server-side data fetching
- [x] Write 6 test suites (25 tests)

### Phase 3: Validation
- [x] All 118 tests passing
- [x] Build clean (21 routes, dashboard now dynamic)

### Phase 4: Documentation
- [x] Sprint file updated

## Acceptance Criteria

- [x] Dashboard matches wireframe layout and styling
- [x] Stats cards show: Total Books, Published, In Progress, Downloads
- [x] Book cards show title, chapter info, status badge, date, progress bar
- [x] "Create New Book" CTA card visible at end of grid
- [x] Clicking book card navigates to book detail
- [x] New book creation works (title + description -> navigates to outline)
- [x] Empty state shown when no books exist
- [x] Loading skeleton shown while data loads

## Postmortem

### What Went Well
- Clean Server Component -> Client Component data flow with props
- Dialog state sharing between header button and grid CTA via lifted state
- All shadcn components installed in a single batch command
- Server-side data fetching with auth protection works seamlessly

### What Could Be Improved
- Date formatting test failed due to timezone differences in jsdom — fixed by using regex matcher instead of exact string match
- Downloads stat is hardcoded to 0 (no tracking yet)
- Progress bar values are derived from status (fixed percentages) rather than actual word count targets

### Key Decisions
- Server Component for page (data fetching) + Client Component orchestrator (interactivity)
- Used `loading.tsx` for streaming skeleton rather than explicit Suspense boundaries
- Progress derived from status: draft=15%, writing=50%, review=80%, published=100%
- Navigate to `/books/[bookId]/outline` after book creation (user chose this)
- Filter button is a visual placeholder — no filtering logic yet

### Metrics
- Components created: 9 (+ barrel export)
- shadcn components installed: 7
- Tests: 25 new tests across 6 suites
- Total tests: 118 passing across 22 test files
- Files changed: 29 (1,187 insertions)

## Notes

Created: 2026-02-13
Completes Epic 2: Book Management and Dashboard (Sprint 4 + Sprint 5).
