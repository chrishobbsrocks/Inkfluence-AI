# Sprint 3: App Shell and Navigation

## Overview

| Field | Value |
|-------|-------|
| Sprint | 3 |
| Title | App Shell and Navigation |
| Epic | 1 - Foundation and Infrastructure |
| Status | Planning |
| Created | 2026-02-13 |
| Started | - |
| Completed | - |

## Goal

Build the application shell with sidebar navigation, header component, and routing structure that exactly matches the wireframe design.

## Background

The wireframe shows a consistent app shell across all screens: a 224px sidebar on the left with navigation items, a header bar with title and action buttons, and a main content area. The sidebar has two modes: a global mode (My Books, Templates, Tools, Account) and a book-context mode (when inside a specific book: Outline, Chapters, Quality Review, Reviews, Preview, Publish).

## Requirements

### Functional Requirements

- [ ] Sidebar component (w-56 / 224px) matching wireframe exactly
- [ ] Global navigation: My Books, Templates, Lead Magnets, Analytics, Settings, Help
- [ ] Book-context navigation: Back to Books, Outline, Chapters, Quality Review, Reviews, Preview, Publish
- [ ] Header component with title and action button slots
- [ ] Routing structure for all screens
- [ ] User profile display in sidebar footer (avatar, name, plan)
- [ ] Active nav item highlighting with stone-900 styling
- [ ] Lucide icons matching wireframe for each nav item

### Non-Functional Requirements

- [ ] Responsive layout (sidebar collapses on mobile)
- [ ] Smooth transitions between navigation states
- [ ] Proper loading states for route transitions

## Dependencies

- **Sprints**: Sprint 1 (shadcn/ui), Sprint 2 (Clerk auth for user profile)
- **External**: None

## Scope

### In Scope

- Sidebar component with both navigation modes
- Header component
- Route structure (/dashboard, /books/[id]/outline, /books/[id]/editor, etc.)
- Layout components (app layout, book layout)
- User profile display from Clerk
- Placeholder pages for each route

### Out of Scope

- Dashboard content (Sprint 5)
- Any feature functionality
- Mobile navigation drawer (defer to later)

## Technical Approach

### Route Structure
```
/dashboard                    -> My Books (global nav)
/books/new                    -> New Book wizard
/books/[bookId]/outline       -> Outline Editor (book nav)
/books/[bookId]/editor        -> Chapter Editor (book nav)
/books/[bookId]/qa            -> Quality Review (book nav)
/books/[bookId]/reviews       -> Collaborative Reviews (book nav)
/books/[bookId]/preview       -> Preview & Format (book nav)
/books/[bookId]/publish       -> Publishing Hub (book nav)
/analytics                    -> Analytics (global nav)
/lead-magnets                 -> Lead Magnets (global nav)
/settings                     -> Settings (global nav)
```

### Layout Structure
```
app/
  layout.tsx                  -> Root layout (fonts, Clerk provider)
  (app)/
    layout.tsx                -> App layout (sidebar global mode, header)
    dashboard/page.tsx        -> My Books
    analytics/page.tsx        -> Analytics
    lead-magnets/page.tsx     -> Lead Magnets
    settings/page.tsx         -> Settings
    books/
      new/page.tsx            -> New book wizard
      [bookId]/
        layout.tsx            -> Book layout (sidebar book mode)
        outline/page.tsx      -> Outline editor
        editor/page.tsx       -> Chapter editor
        qa/page.tsx           -> Quality review
        reviews/page.tsx      -> Reviews
        preview/page.tsx      -> Preview
        publish/page.tsx      -> Publish
```

### Component Reference (from wireframe)
- Sidebar: w-56, bg-stone-50, border-r border-stone-200
- Nav items: px-3 py-2, rounded-md, text-xs
- Active item: bg-white, shadow-sm, border border-stone-200, font-semibold
- Inactive item: text-stone-500, hover:text-stone-700, hover:bg-stone-100
- Section labels: text-[10px], font-semibold, text-stone-400, uppercase, tracking-widest
- Header: h-13, px-5, border-b border-stone-200, bg-white
- User avatar: w-7 h-7, rounded-full, bg-stone-300

## Tasks

### Phase 1: Planning
- [ ] Map all routes from wireframes
- [ ] Identify shared vs. page-specific layout elements

### Phase 2: Implementation
- [ ] Create Sidebar component with global and book-context modes
- [ ] Create SidebarItem component with active state styling
- [ ] Create AppHeader component with title and action button slots
- [ ] Set up Next.js App Router route structure
- [ ] Create (app) route group with global layout
- [ ] Create books/[bookId] route group with book layout
- [ ] Create placeholder pages for all routes
- [ ] Integrate Clerk user profile in sidebar footer
- [ ] Add all Lucide icons per wireframe

### Phase 3: Validation
- [ ] All routes accessible and rendering correct layout
- [ ] Sidebar switches between global and book-context mode
- [ ] Active nav item highlights correctly
- [ ] User profile displays from Clerk session
- [ ] Layout matches wireframe pixel-for-pixel

### Phase 4: Documentation
- [ ] Document route structure

## Acceptance Criteria

- [ ] Sidebar renders with correct styling matching wireframe
- [ ] Global nav shows: My Books, Templates, Lead Magnets, Analytics, Settings, Help
- [ ] Book-context nav shows: Back arrow, Outline, Chapters, Quality Review, Reviews, Preview, Publish
- [ ] Header component renders with dynamic title
- [ ] All routes resolve to correct layout and placeholder content
- [ ] User avatar, name, and plan display in sidebar footer
- [ ] Active navigation item has correct visual treatment
- [ ] No TypeScript errors, no console warnings

## Open Questions

- None

## Notes

Reference: The Sidebar function in wireframe file (lines 32-89) and SidebarItem (lines 92-107) should be used as the exact design spec.
The stone color palette is used throughout: stone-50 (sidebar bg), stone-200 (borders), stone-400 (muted text), stone-900 (primary/active).
