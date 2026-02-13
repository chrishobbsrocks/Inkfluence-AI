---
epic: 1
title: "Foundation and Infrastructure"
status: planning
created: 2026-02-13
started: null
completed: null
---

# Epic 1: Foundation and Infrastructure

## Overview

Establish the core technical foundation for Inkfluence AI. This epic sets up the Next.js 15 project with TypeScript, configures the database (Neon PostgreSQL + Drizzle ORM), integrates authentication (Clerk), and builds the application shell with navigation. Everything that follows depends on this being rock-solid.

## Success Criteria

- [ ] Next.js 15 App Router project deployed to Vercel with CI/CD
- [ ] Neon PostgreSQL database provisioned with Drizzle ORM schema
- [ ] Clerk authentication working (sign up, sign in, protected routes)
- [ ] App shell matches wireframe design (sidebar, header, routing)
- [ ] shadcn/ui + Tailwind CSS configured with stone color palette
- [ ] All environment variables properly configured for dev and prod

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| UI | shadcn/ui + Tailwind CSS + Radix |
| Database | Neon (serverless PostgreSQL) |
| ORM | Drizzle ORM |
| Auth | Clerk |
| Deployment | Vercel |

## Sprints

| Sprint | Title | Status |
|--------|-------|--------|
| 1 | Project Bootstrap and Deploy | planned |
| 2 | Database ORM and Auth | planned |
| 3 | App Shell and Navigation | planned |
| 19 | Docker and Local Development Setup | planned |

## Team Assignments

| Sprint | Team | Notes |
|--------|------|-------|
| 1, 2, 3 | Dev Team 1 | Sequential foundation work |
| 19 | Dev Team 2 | Parallel with Sprints 1-3 |

## Notes

Created: 2026-02-13
This is the critical path — every other epic depends on Epic 1 being complete.
Sprint 19 (Docker) runs in parallel, giving Dev Team 2 productive work during foundation setup.
