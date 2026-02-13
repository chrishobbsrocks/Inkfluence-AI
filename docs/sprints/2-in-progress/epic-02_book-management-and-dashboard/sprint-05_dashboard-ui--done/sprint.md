# Sprint 5: Dashboard UI

## Overview

| Field | Value |
|-------|-------|
| Sprint | 5 |
| Title | Dashboard UI |
| Epic | 2 - Book Management and Dashboard |
| Status | Planning |
| Created | 2026-02-13 |
| Started | - |
| Completed | - |

## Goal

Build the My Books dashboard screen matching the wireframe exactly, using the book data layer from Sprint 4.

## Background

The dashboard is the user's home base. It shows statistics (total books, published, in progress, downloads), a grid of book cards with progress indicators, and a "Create New Book" CTA. This is the first screen users see after signing in.

## Requirements

### Functional Requirements

- [ ] Stats row: Total Books, Published, In Progress, Downloads (4 cards)
- [ ] Book grid showing all user's books as cards
- [ ] Each book card: title, chapter info, word count, status badge, date, progress bar
- [ ] "Create New Book" card with dashed border and plus icon
- [ ] New Book button in header
- [ ] Filter button in header
- [ ] Status badges: Published (bg-stone-900), Writing (secondary), Draft (secondary)
- [ ] Progress bars for in-progress books
- [ ] Clicking a book navigates to /books/[bookId]/outline

### Non-Functional Requirements

- [ ] Loading skeleton while books fetch
- [ ] Empty state when no books exist
- [ ] Responsive grid (3 cols desktop, 2 tablet, 1 mobile)

## Dependencies

- **Sprints**: Sprint 3 (app shell), Sprint 4 (book data layer)
- **External**: None

## Scope

### In Scope

- Dashboard page at /dashboard
- Stats cards component
- Book card grid component
- Book card component with all states
- Empty state
- Loading skeleton
- New book creation dialog/flow (basic - just title + description)

### Out of Scope

- Book templates
- Advanced filtering UI
- Analytics data (downloads count can be placeholder for now)

## Technical Approach

### Reference: Wireframe DashboardScreen (lines 122-189)

Key visual specs from wireframe:
- Stats: grid-cols-4 gap-3, Card with p-4 text-center
- Book grid: grid-cols-3 gap-3
- Book card: border-stone-200, h-20 cover placeholder, font-semibold text-sm title
- Progress: h-1 Progress component
- Status badge: text-[10px] px-2 py-0.5
- New book card: border-dashed border-stone-300, Plus icon, "Create New Book" text

### Data Fetching
- Use TanStack Query for client-side data fetching
- Or: Use Next.js Server Components for initial data load
- Stats calculated from book data (counts by status)

## Tasks

### Phase 1: Planning
- [ ] Review wireframe for exact styling
- [ ] Decide on data fetching strategy (RSC vs. client-side)

### Phase 2: Implementation
- [ ] Create StatsCards component (4-card grid)
- [ ] Create BookCard component (cover placeholder, title, meta, badge, progress)
- [ ] Create BookGrid component (responsive grid layout)
- [ ] Create CreateBookCard component (dashed border CTA)
- [ ] Create EmptyState component
- [ ] Create LoadingSkeleton component
- [ ] Build dashboard page composing all components
- [ ] Wire up data fetching from Sprint 4 APIs
- [ ] Implement new book creation dialog
- [ ] Add navigation from book card to book detail

### Phase 3: Validation
- [ ] Dashboard displays book data from database
- [ ] Stats cards show correct counts
- [ ] Book cards render with correct status badges and progress
- [ ] New book creation works and appears in grid
- [ ] Loading states display while fetching

## Acceptance Criteria

- [ ] Dashboard matches wireframe layout and styling
- [ ] Stats cards show: Total Books, Published, In Progress, Downloads
- [ ] Book cards show title, chapter info, status badge, date, progress bar
- [ ] "Create New Book" CTA card visible at end of grid
- [ ] Clicking book card navigates to book detail
- [ ] New book creation works (title + description → appears in grid)
- [ ] Empty state shown when no books exist
- [ ] Loading skeleton shown while data loads

## Notes

Wireframe reference: DashboardScreen function, lines 122-189 of inkfluence-ai-hifi-wireframes.jsx
Color reference: stone palette throughout. Published = bg-stone-900 badge. Stats = text-2xl font-bold.
