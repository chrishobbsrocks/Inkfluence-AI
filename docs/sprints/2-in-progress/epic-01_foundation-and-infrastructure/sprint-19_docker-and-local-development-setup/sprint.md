# Sprint 19: Docker and Local Development Setup

## Overview

| Field | Value |
|-------|-------|
| Sprint | 19 |
| Title | Docker and Local Development Setup |
| Epic | 1 - Foundation and Infrastructure |
| Status | Planning |
| Created | 2026-02-13 |
| Started | - |
| Completed | - |
| Assigned | Dev Team 2 |

## Goal

Containerize the Inkfluence AI application with Docker for consistent local development, testing, and preview across all environments.

## Background

The team wants a local Docker setup to test and view the application without depending on cloud services during development. This enables consistent environments across Dev Team 1 and Dev Team 2, faster iteration loops, and the ability to demo the app locally.

## Requirements

### Functional Requirements

- [ ] Dockerfile for the Next.js 15 application (multi-stage build)
- [ ] docker-compose.yml orchestrating all services
- [ ] Local PostgreSQL container as alternative to Neon (for offline dev)
- [ ] Hot reload working inside Docker container (volume mounts)
- [ ] Environment variable management (.env.docker)
- [ ] Health check endpoint (/api/health)
- [ ] Single command to start entire stack: `docker compose up`
- [ ] Single command to stop: `docker compose down`
- [ ] Database seeding script for local development data

### Non-Functional Requirements

- [ ] Container builds in under 60 seconds
- [ ] Hot reload reflects changes within 2 seconds
- [ ] Docker setup documented in README
- [ ] Works on macOS (Apple Silicon and Intel)

## Dependencies

- **Sprints**: Sprint 1 (project must exist to containerize), Sprint 2 (database schema for local PG)
- **External**: Docker Desktop installed on dev machines

## Scope

### In Scope

- Dockerfile (multi-stage: deps → build → run)
- docker-compose.yml (Next.js app + PostgreSQL)
- .env.docker with local development defaults
- Volume mounts for hot reload
- Database migration on container startup
- Seed script for test data
- Health check endpoint
- README documentation for Docker usage

### Out of Scope

- Production Docker deployment (Vercel handles production)
- CI/CD Docker integration
- Docker Swarm / Kubernetes

## Technical Approach

### Dockerfile (Multi-stage)
```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

# Stage 2: Development
FROM node:20-alpine AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["pnpm", "dev"]
```

### docker-compose.yml
```yaml
services:
  app:
    build:
      context: .
      target: dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    env_file:
      - .env.docker
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: inkfluence
      POSTGRES_USER: inkfluence
      POSTGRES_PASSWORD: localdev123
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U inkfluence"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
```

### .env.docker
```
DATABASE_URL=postgresql://inkfluence:localdev123@db:5432/inkfluence
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_placeholder
CLERK_SECRET_KEY=sk_test_placeholder
ANTHROPIC_API_KEY=sk-ant-placeholder
```

### Database Seeding
Create a seed script (`scripts/seed.ts`) that:
1. Creates a test user
2. Creates 2-3 sample books with different statuses
3. Creates sample chapters with content
4. Creates a sample outline

### Health Check
```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({ status: 'ok', timestamp: new Date().toISOString() })
}
```

## Tasks

### Phase 1: Planning
- [ ] Verify Docker Desktop is available
- [ ] Review Next.js Docker best practices

### Phase 2: Implementation
- [ ] Create Dockerfile with multi-stage build (deps + dev)
- [ ] Create docker-compose.yml (app + postgres)
- [ ] Create .env.docker with local defaults
- [ ] Configure volume mounts for hot reload
- [ ] Create health check API endpoint (/api/health)
- [ ] Create database migration script that runs on startup
- [ ] Create seed script (scripts/seed.ts) with sample data
- [ ] Add .dockerignore (node_modules, .next, .git, etc.)
- [ ] Test hot reload works inside container
- [ ] Test database connectivity from app to local PG

### Phase 3: Validation
- [ ] `docker compose up` starts both services successfully
- [ ] App accessible at http://localhost:3000
- [ ] Hot reload works (change a file → see update in browser)
- [ ] Database migrations run automatically
- [ ] Seed data populates sample books
- [ ] Health check returns 200 OK
- [ ] `docker compose down` cleans up properly
- [ ] Works on Apple Silicon Mac

### Phase 4: Documentation
- [ ] Update README with Docker instructions
- [ ] Document environment variable overrides
- [ ] Document common Docker commands

## Acceptance Criteria

- [ ] `docker compose up` starts the full stack in one command
- [ ] App accessible at http://localhost:3000
- [ ] Hot reload works inside Docker container
- [ ] Local PostgreSQL running and accessible
- [ ] Database schema created via Drizzle migration
- [ ] Sample data seeded for testing
- [ ] Health check endpoint returns 200
- [ ] README has Docker setup instructions
- [ ] Works on macOS (both architectures)
- [ ] Container builds in under 60 seconds

## Open Questions

- Should we support running against Neon OR local PG? (Recommend: support both via env var)
- Do the dev teams need separate database instances or shared?

## Notes

This sprint runs IN PARALLEL with Sprints 1-3 (which Dev Team 1 handles).
Dev Team 2 should start this after Sprint 1 is complete (need the Next.js project to exist).
The Docker setup enables both teams to have consistent local environments.
