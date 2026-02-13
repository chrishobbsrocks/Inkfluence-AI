# Sprint 2: Database ORM and Auth

## Overview

| Field | Value |
|-------|-------|
| Sprint | 2 |
| Title | Database ORM and Auth |
| Epic | 1 - Foundation and Infrastructure |
| Status | Planning |
| Created | 2026-02-13 |
| Started | - |
| Completed | - |

## Goal

Set up Neon PostgreSQL database with Drizzle ORM schema and integrate Clerk authentication with protected routes.

## Background

The app needs a relational database for books, chapters, outlines, and user data. Neon provides serverless PostgreSQL that scales with Vercel. Drizzle ORM gives us type-safe queries. Clerk handles authentication so we don't build auth from scratch.

## Requirements

### Functional Requirements

- [ ] Neon PostgreSQL database provisioned and connected
- [ ] Drizzle ORM configured with type-safe schema
- [ ] Core database schema: users, books, chapters, outlines, outline_sections
- [ ] Clerk authentication integrated (sign up, sign in, sign out)
- [ ] Protected routes (redirect to sign-in if not authenticated)
- [ ] User profile synced between Clerk and database
- [ ] Database migrations working via Drizzle Kit

### Non-Functional Requirements

- [ ] Connection pooling configured for serverless environment
- [ ] Database schema supports soft deletes (deleted_at timestamps)
- [ ] All timestamps in UTC
- [ ] Proper indexing on frequently queried columns

## Dependencies

- **Sprints**: Sprint 1 (project must be bootstrapped)
- **External**: Neon account, Clerk account, API keys

## Scope

### In Scope

- Neon database setup and connection
- Drizzle ORM configuration and schema
- Core data models (users, books, chapters, outlines)
- Clerk auth integration
- Protected route middleware
- Database migrations
- Clerk webhook for user sync

### Out of Scope

- UI components (Sprint 3)
- Book CRUD API routes (Sprint 4)
- Any feature-specific data models

## Technical Approach

### Database Schema

```sql
-- users (synced from Clerk)
users: id, clerk_id, email, name, avatar_url, plan, created_at, updated_at

-- books
books: id, user_id, title, description, status (draft|writing|review|published),
       cover_url, word_count, chapter_count, created_at, updated_at, deleted_at

-- chapters
chapters: id, book_id, title, content (text), order_index, word_count,
          status (outline|draft|writing|complete), created_at, updated_at

-- outlines
outlines: id, book_id, topic, audience, expertise_level,
          conversation_history (jsonb), created_at, updated_at

-- outline_sections
outline_sections: id, outline_id, chapter_title, key_points (jsonb),
                  order_index, ai_suggested (boolean), created_at
```

### Auth Flow
1. Clerk middleware protects all routes except /sign-in, /sign-up, /api/webhooks
2. Clerk webhook syncs user data to our database on user.created and user.updated
3. User ID from Clerk session used to scope all database queries

## Tasks

### Phase 1: Planning
- [ ] Verify Neon and Clerk accounts are available
- [ ] Review schema design for completeness

### Phase 2: Implementation
- [ ] Install drizzle-orm, drizzle-kit, @neondatabase/serverless
- [ ] Configure Neon connection with connection pooling
- [ ] Define Drizzle schema (users, books, chapters, outlines, outline_sections)
- [ ] Set up Drizzle Kit for migrations (drizzle.config.ts)
- [ ] Run initial migration to create tables
- [ ] Install @clerk/nextjs
- [ ] Configure Clerk middleware for route protection
- [ ] Create sign-in and sign-up pages using Clerk components
- [ ] Set up Clerk webhook endpoint for user sync
- [ ] Create database utility functions (db connection, common queries)

### Phase 3: Validation
- [ ] Database tables created successfully in Neon
- [ ] Clerk sign-up creates a user record in our database
- [ ] Protected routes redirect unauthenticated users
- [ ] Drizzle queries return typed results
- [ ] Migrations can be run and rolled back

### Phase 4: Documentation
- [ ] Document database schema in docs/
- [ ] Add Neon and Clerk env vars to .env.example

## Acceptance Criteria

- [ ] Neon database accessible and schema deployed
- [ ] `pnpm drizzle-kit push` runs successfully
- [ ] Clerk sign-up/sign-in flow works end-to-end
- [ ] Unauthenticated users redirected to /sign-in
- [ ] Clerk webhook syncs user to database
- [ ] TypeScript types generated from Drizzle schema
- [ ] All tests passing

## Open Questions

- Does the user have Neon and Clerk accounts set up?
- What Clerk plan? (Free tier supports up to 10k MAUs)

## Notes

Environment variables needed:
- DATABASE_URL (Neon connection string)
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY
- CLERK_WEBHOOK_SECRET
