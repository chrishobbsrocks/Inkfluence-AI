# Project Instructions

## Workflow System

This project uses an **AI-assisted development workflow** with parallel agents, skills, and slash commands.

**Workflow Version**: See `.claude/WORKFLOW_VERSION` for current version.

### Quick Start

```bash
/sprint-new "Feature Name"    # Create a new sprint
/sprint-start <N>             # Initialize sprint, spawn Plan agent
/sprint-next                  # Advance to next step
/sprint-status                # Check progress and agent status
/sprint-complete              # Pre-flight checklist and finish
/sprint-postmortem            # Capture learnings
```

### How It Works

```
Phase 1: Planning (sequential)
├── Read sprint → Plan agent designs team → Clarify requirements

Phase 2: Implementation (PARALLEL)
├── Backend agent ──┐
├── Frontend agent ─┼── Run simultaneously
└── Test agent ─────┘

Phase 3: Validation (sequential)
├── Integrate → Run tests → Quality review → User approval

Phase 4: Complete (sequential)
├── Commit → Move to done → Postmortem
```

### Key Concepts

- **Agents**: Plan, product-engineer, quality-engineer, test-runner, devops-engineer
- **State Files**: `.claude/sprint-N-state.json` tracks each sprint
- **Sprint Counter**: `docs/sprints/next-sprint.txt` auto-assigns numbers

### Sprint Directories

| Directory | Purpose |
|-----------|---------|
| `docs/sprints/1-todo/` | Planned sprints waiting to start |
| `docs/sprints/2-in-progress/` | Currently active sprints |
| `docs/sprints/3-done/` | Completed sprints |
| `docs/sprints/5-aborted/` | Cancelled/abandoned sprints |

### Workflow Enforcement

The sprint workflow is enforced via hooks. Key rules:
- Cannot skip steps - must complete current before advancing
- Cannot commit without completing sprint
- All sprints require postmortem before completion
- Sprint numbers auto-assigned from counter file

### Epic Management

Group related sprints into epics:

```bash
/epic-new "Epic Name"         # Create new epic
/epic-start <N>               # Start working on epic
/sprint-new "Feature" --epic=N # Add sprint to epic
/epic-complete <N>            # Finish epic when all sprints done
```

---

## Project: Inkfluence AI

AI-powered ebook creation platform that transforms ideas into complete, formatted ebooks within minutes.

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict mode) |
| UI | shadcn/ui + Tailwind CSS + Radix |
| Database | Neon (serverless PostgreSQL) |
| ORM | Drizzle ORM |
| Auth | Clerk |
| AI | Claude API (Anthropic SDK) |
| Rich Text Editor | Tiptap (ProseMirror) |
| File Export | @react-pdf/renderer + epub-gen-memory |
| Email | Resend |
| Storage | Vercel Blob |
| Data Fetching | TanStack Query |
| Payments | Stripe (post-MVP) |
| Deployment | Vercel |
| Local Dev | Docker + docker-compose |

### Team Structure

| Team | Domain | Sprints |
|------|--------|---------|
| Dev Team 1 | Infrastructure, Data Layer, UI Screens, Export | 1, 2, 3, 4, 5, 8, 10, 13, 14, 16, 17 |
| Dev Team 2 | Docker, AI Integration, Content Generation, QA Engine | 19, 6, 7, 9, 11, 12, 15, 18 |

**IMPORTANT**: Dev Teams must NOT modify files outside their assigned domain without coordination. Check sprint spec for exact file ownership.

### Code Standards

- TypeScript strict mode — no `any` types
- All components in `src/components/` with clear naming
- Server actions in `src/server/actions/`
- Database queries in `src/server/queries/`
- AI prompts in `src/lib/ai/prompts/`
- Zod schemas for all API inputs
- Use shadcn/ui components — do not install alternative UI libraries
- Stone color palette throughout (stone-50 through stone-900)
- DM Sans for body text, Instrument Serif for display/headings

### Testing Requirements

- API routes must have integration tests
- Server actions must have unit tests
- AI prompts should have example input/output tests
- Run `pnpm test` before completing any sprint

### Deployment

- **Production**: Vercel (auto-deploy from main branch)
- **Local Dev**: `docker compose up` (see Docker setup in Sprint 19)
- **Database**: Neon (production) or local PostgreSQL (Docker)

### Vercel Build Rules

Vercel uses an **Ignored Build Step** script (`scripts/vercel-ignore-build.sh`) to skip unnecessary deployments.

**Pushes that SKIP deployment:**
- `docs/**`, `tests/**`, `scripts/**`, `*.md`, `.claude/**`
- `docker-compose.yml`, `Dockerfile`, `.dockerignore`
- `drizzle/**` (migration files), `.github/**`

**Pushes that TRIGGER deployment:**
- `src/**` (any source code change)
- `public/**`, `package.json`, `pnpm-lock.yaml`
- `next.config.*`, `tailwind.config.*`, `tsconfig.json`

**For Dev Teams:** If your sprint only touches docs, tests, migrations, or Docker config — your push will NOT trigger a Vercel build. This is intentional. Only source code and config changes deploy.

### Local Development (Docker)

```bash
# Start the full stack
docker compose up

# Stop
docker compose down

# Access app
http://localhost:3000

# Health check
http://localhost:3000/api/health
```

### Environment Variables

See `.env.example` for all required variables:
- `DATABASE_URL` — Neon connection string (or local PG in Docker)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — Clerk publishable key
- `CLERK_SECRET_KEY` — Clerk secret key
- `CLERK_WEBHOOK_SECRET` — Clerk webhook signing secret
- `ANTHROPIC_API_KEY` — Claude API key

### Design Reference

- Wireframes: `/Users/chrishobbs/Downloads/inkfluence-ai-hifi-wireframes.jsx`
- PRD: `/Users/chrishobbs/Downloads/inkfluence-ai-prd.md`
- Color palette: Stone (stone-50 through stone-900)
- Fonts: DM Sans (body), Instrument Serif (headings)
- Icons: Lucide React
