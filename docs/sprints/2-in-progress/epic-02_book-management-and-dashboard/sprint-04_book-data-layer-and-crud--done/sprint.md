# Sprint 4: Book Data Layer and CRUD

## Overview

| Field | Value |
|-------|-------|
| Sprint | 4 |
| Title | Book Data Layer and CRUD |
| Epic | 2 - Book Management and Dashboard |
| Status | Planning |
| Created | 2026-02-13 |
| Started | - |
| Completed | - |

## Goal

Build the complete data access layer for books including API routes for CRUD operations, status management, and server actions.

## Background

Users need to create, view, update, and delete book projects. Books go through a lifecycle: Draft → Writing → Review → Published. This sprint creates the backend infrastructure that the Dashboard UI (Sprint 5) and all subsequent features will use.

## Requirements

### Functional Requirements

- [ ] Create book (title, description, template type)
- [ ] Read book (single + list with pagination)
- [ ] Update book (title, description, status, cover)
- [ ] Soft delete book (set deleted_at, don't hard delete)
- [ ] Book status transitions: Draft → Writing → Review → Published
- [ ] List books for current user with filtering (by status) and sorting (by date, title)
- [ ] Book statistics calculation (total word count, chapter count)
- [ ] Server actions for mutations (Next.js Server Actions)

### Non-Functional Requirements

- [ ] All queries scoped to authenticated user (no cross-user data access)
- [ ] Pagination with cursor-based or offset pagination
- [ ] Input validation with Zod schemas
- [ ] Proper error handling with typed error responses

## Dependencies

- **Sprints**: Sprint 2 (database schema and auth)
- **External**: None

## Scope

### In Scope

- API route handlers for book CRUD
- Server actions for book mutations
- Zod validation schemas for book inputs
- Data access functions (queries and mutations)
- Book status state machine

### Out of Scope

- Dashboard UI (Sprint 5)
- Chapter CRUD (handled in later sprints)
- Cover upload functionality

## Technical Approach

### Directory Structure
```
src/
  lib/
    db/
      index.ts              → Database connection
      schema.ts             → Drizzle schema (from Sprint 2)
    validations/
      book.ts               → Zod schemas for book inputs
  server/
    actions/
      books.ts              → Server actions for book mutations
    queries/
      books.ts              → Server-side query functions
  app/
    api/
      books/
        route.ts            → GET (list), POST (create)
        [bookId]/
          route.ts          → GET (single), PATCH (update), DELETE (soft delete)
```

### Book Status State Machine
```
Draft → Writing (when first chapter started)
Writing → Review (when all chapters complete)
Review → Published (when published to at least one platform)
Any → Draft (can revert to draft)
```

### Key Patterns
- Use Drizzle ORM for all database operations
- Server actions with `"use server"` for form mutations
- Zod for runtime input validation
- Scope all queries with `where: eq(books.userId, currentUserId)`

## Tasks

### Phase 1: Planning
- [ ] Verify database schema from Sprint 2 supports all needed fields
- [ ] Design API response shapes

### Phase 2: Implementation
- [ ] Create Zod validation schemas for book create/update
- [ ] Implement book query functions (getBooks, getBookById, getBookStats)
- [ ] Implement book mutation functions (createBook, updateBook, deleteBook)
- [ ] Create API route handlers (GET /api/books, POST /api/books, etc.)
- [ ] Create server actions (createBookAction, updateBookAction, deleteBookAction)
- [ ] Implement book status transition logic with validation
- [ ] Add proper error handling and typed responses

### Phase 3: Validation
- [ ] Test all CRUD operations work correctly
- [ ] Verify user scoping (user A cannot see user B's books)
- [ ] Test status transitions (valid transitions succeed, invalid ones fail)
- [ ] Verify soft delete works (deleted books don't appear in lists)

## Acceptance Criteria

- [ ] Can create a book with title and description via API/server action
- [ ] Can list books for authenticated user with pagination
- [ ] Can filter books by status
- [ ] Can update book title, description, and status
- [ ] Soft delete marks book as deleted without removing from database
- [ ] Invalid status transitions return appropriate errors
- [ ] All queries properly scoped to authenticated user
- [ ] Zod validation rejects invalid inputs with helpful error messages
- [ ] TypeScript types are properly inferred from Drizzle schema

## Notes

This is a pure backend sprint — no UI work. Sprint 5 builds the dashboard UI on top of this.
