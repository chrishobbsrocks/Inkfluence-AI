---
sprint: 4
title: "Book Data Layer and CRUD"
type: fullstack
epic: 2
status: done
created: 2026-02-13T13:13:27Z
started: 2026-02-13T14:43:51Z
completed: 2026-02-13
hours: 0.2
workflow_version: "3.1.0"


---

# Sprint 4: Book Data Layer and CRUD

## Overview

| Field | Value |
|-------|-------|
| Sprint | 4 |
| Title | Book Data Layer and CRUD |
| Type | fullstack |
| Epic | 2 |
| Status | Done |
| Created | 2026-02-13 |
| Started | 2026-02-13 |
| Completed | 2026-02-13 |

## Goal

Build the complete data access layer for books including API routes, server actions, validation schemas, and a status state machine.

## Background

Users need to create, view, update, and delete book projects. Books go through a lifecycle: Draft -> Writing -> Review -> Published. This sprint creates the backend infrastructure that the Dashboard UI (Sprint 5) and all subsequent features will use.

## Requirements

### Functional Requirements

- [x] Create book (title, description)
- [x] Read book (single + list with pagination)
- [x] Update book (title, description, status)
- [x] Soft delete book (set deleted_at, don't hard delete)
- [x] Book status transitions: Draft -> Writing -> Review -> Published
- [x] List books with filtering (by status) and sorting (by date, title)
- [x] Server actions for mutations (Next.js Server Actions)
- [x] API route handlers for all CRUD operations

### Non-Functional Requirements

- [x] All queries scoped to authenticated user
- [x] Offset-based pagination
- [x] Input validation with Zod schemas
- [x] Typed error responses with discriminated unions

## Dependencies

- **Sprints**: Sprint 2 (database schema and auth)
- **External**: None

## Scope

### In Scope

- Zod validation schemas for book inputs
- Query functions (getBooks, getBookById, getBookStats)
- Mutation functions (createBook, updateBook, softDeleteBook)
- API routes (GET/POST /api/books, GET/PATCH/DELETE /api/books/[bookId])
- Server actions (createBookAction, updateBookAction, deleteBookAction)
- Book status state machine

### Out of Scope

- Dashboard UI (Sprint 5)
- Chapter CRUD
- Cover upload functionality

## Technical Approach

- Zod schemas in `src/lib/validations/books.ts` for runtime validation
- Status machine in `src/lib/book-status-machine.ts` with valid transition map
- Query functions in `src/server/queries/books.ts` using Drizzle ORM
- Mutation functions in `src/server/mutations/books.ts` with MutationResult discriminated union
- API routes resolve Clerk auth -> internal user ID via getUserByClerkId
- Server actions accept `unknown` inputs and validate internally

## Tasks

### Phase 1: Planning
- [x] Review requirements and existing schema
- [x] Design architecture with Plan agent
- [x] Clarify requirements (added description column, chose offset pagination)

### Phase 2: Implementation
- [x] Create Zod validation schemas
- [x] Implement book status state machine
- [x] Implement query functions (getBooks, getBookById, getBookStats)
- [x] Implement mutation functions (createBook, updateBook, softDeleteBook)
- [x] Create API route handlers
- [x] Create server actions
- [x] Write tests (validations, mutations, API)

### Phase 3: Validation
- [x] All 93 tests passing
- [x] Build clean (21 routes)

### Phase 4: Documentation
- [x] Sprint file updated

## Acceptance Criteria

- [x] Can create a book with title and description via API/server action
- [x] Can list books for authenticated user with pagination
- [x] Can filter books by status
- [x] Can update book title, description, and status
- [x] Soft delete marks book as deleted without removing from database
- [x] Invalid status transitions return appropriate errors
- [x] All queries properly scoped to authenticated user
- [x] Zod validation rejects invalid inputs with helpful error messages

## Postmortem

### What Went Well
- Clean separation of concerns: validations, queries, mutations, API routes, server actions
- MutationResult discriminated union provides typed error handling without exceptions
- Book status state machine is simple and testable
- Existing schema already had description and coverUrl columns from Sprint 2

### What Could Be Improved
- Initial test used `vi.clearAllMocks()` which doesn't reset `mockResolvedValueOnce` queues, causing a leak between tests. Fixed by switching to `vi.resetAllMocks()`.
- Sprint lifecycle automation committed sprint 4 files as part of sprint 19 completion (timing overlap)

### Key Decisions
- Offset pagination over cursor-based (simpler for dashboard with modest data volumes)
- `MutationResult<T>` discriminated union for typed errors at the mutation layer
- Simpler `ActionResult<T>` for server actions (no error codes, just messages for UI)
- `resolveAuth()` helper in API routes to DRY auth + user resolution
- Status machine allows revert to "draft" from any state
- `getBookStats` uses conditional aggregation in a single SQL query

### Metrics
- Files created: 10 (3 lib, 3 server, 2 API routes, 3 test files)
- Tests: 53 new tests (31 validation, 7 mutation, 15 API)
- Total tests: 93 passing across 16 test files

## Notes

Created: 2026-02-13
This is a pure backend sprint - no UI work. Sprint 5 builds the dashboard UI on top of this.
