---
sprint: 19
title: "Docker and Local Development Setup"
type: fullstack
epic: 1
status: done
created: 2026-02-13T13:29:16Z
started: 2026-02-13T14:45:00Z
completed: 2026-02-13
hours: 0.5
workflow_version: "3.1.0"

---

# Sprint 19: Docker and Local Development Setup

## Overview

| Field | Value |
|-------|-------|
| Sprint | 19 |
| Title | Docker and Local Development Setup |
| Type | fullstack |
| Epic | 1 |
| Status | In Progress |
| Created | 2026-02-13 |
| Started | 2026-02-13 |
| Completed | - |

## Goal

Create a Docker-based local development environment that runs the Next.js app and PostgreSQL locally, replacing the need for Neon cloud database during development.

## Background

The project currently requires a Neon cloud PostgreSQL connection for all development. This creates friction for local development, requires internet connectivity, and makes it harder to test database changes safely. A Docker-based local environment with a standard PostgreSQL instance will improve developer experience and enable offline development.

## Requirements

### Functional Requirements

- [ ] Multi-stage Dockerfile (dev with hot reload + production with standalone)
- [ ] docker-compose.yml orchestrating app + PostgreSQL 16 services
- [ ] Dual database driver support (Neon for production, postgres.js for Docker)
- [ ] .env.docker with local development defaults
- [ ] Docker entrypoint script that pushes Drizzle schema before app starts
- [ ] Database seed script with sample data
- [ ] Docker convenience scripts in package.json (docker:up, docker:down, docker:reset)
- [ ] .dockerignore for clean build context

### Non-Functional Requirements

- [ ] Hot reload works in Docker with <3 second latency
- [ ] docker compose up starts everything in single command
- [ ] Health checks on both app and database services
- [ ] Existing Neon/Vercel production setup is not affected
- [ ] All existing tests continue to pass

## Dependencies

- **Sprints**: Sprint 2 (Database ORM) - provides Drizzle schema
- **External**: Docker Desktop installed on developer machine

## Scope

### In Scope

- Dockerfile (multi-stage: dev + production)
- docker-compose.yml (app + PostgreSQL)
- Dual database driver (Neon + postgres.js)
- .env.docker configuration
- Docker entrypoint script
- Database seed script
- .dockerignore
- Package.json docker scripts
- Tests for driver switching logic
- next.config.ts standalone output

### Out of Scope

- CI/CD Docker integration
- Redis or other additional services
- Production Docker deployment
- Kubernetes configuration
- Docker image publishing

## Technical Approach

### Dual Database Driver
Refactor `src/server/db/index.ts` to conditionally use either `@neondatabase/serverless` (production) or `postgres` (postgres.js, local Docker) based on `DB_DRIVER` environment variable. Both drivers share Drizzle ORM's `PgDatabase` API, making the switch transparent to consumers.

### Docker Architecture
- Multi-stage Dockerfile: deps -> dev -> builder -> production
- docker-compose targets the `dev` stage for local development
- PostgreSQL 16 Alpine with persistent volume
- App health check via /api/health endpoint
- DB health check via pg_isready
- Entrypoint script waits for DB, runs drizzle-kit push, then starts app

## Tasks

### Phase 1: Planning
- [x] Review requirements
- [x] Design architecture
- [x] Clarify requirements

### Phase 2: Implementation
- [ ] Add postgres and tsx dependencies
- [ ] Refactor database connection for dual driver support
- [ ] Write tests for driver switching
- [ ] Create .dockerignore
- [ ] Create Dockerfile
- [ ] Create docker-compose.yml
- [ ] Create .env.docker
- [ ] Create docker-entrypoint.sh
- [ ] Create seed script
- [ ] Update next.config.ts with standalone output
- [ ] Update .env.example with DB_DRIVER documentation
- [ ] Add Docker scripts to package.json

### Phase 3: Validation
- [ ] All existing tests pass
- [ ] New driver switching tests pass
- [ ] Docker compose up works
- [ ] Health check responds
- [ ] Hot reload works
- [ ] Seed script runs

### Phase 4: Documentation
- [ ] Sprint file updated with results

## Acceptance Criteria

- [ ] `docker compose up` starts app + PostgreSQL from single command
- [ ] `curl http://localhost:3000/api/health` returns 200
- [ ] Database schema auto-pushes on container start
- [ ] Hot reload works for source code changes
- [ ] All existing tests pass (no regressions)
- [ ] New driver switching tests pass
- [ ] `pnpm db:seed` populates sample data
- [ ] Existing Neon production setup unaffected

## Postmortem

See [Sprint 19 Postmortem](./sprint-19_postmortem.md)

## Notes

Created: 2026-02-13
Team: Dev Team 2
