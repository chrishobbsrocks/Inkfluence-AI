# Sprint 1: Project Bootstrap and Deploy

## Overview

| Field | Value |
|-------|-------|
| Sprint | 1 |
| Title | Project Bootstrap and Deploy |
| Epic | 1 - Foundation and Infrastructure |
| Status | Planning |
| Created | 2026-02-13 |
| Started | - |
| Completed | - |

## Goal

Set up the Next.js 15 project with TypeScript, Tailwind CSS, and shadcn/ui, then deploy to Vercel with working CI/CD.

## Background

Inkfluence AI is an AI-powered ebook creation platform. This sprint establishes the project foundation that all subsequent features build upon. The wireframes use React with shadcn/ui components and a stone color palette with DM Sans + Instrument Serif fonts.

## Requirements

### Functional Requirements

- [ ] Next.js 15 project with App Router (NOT Pages Router)
- [ ] TypeScript strict mode enabled
- [ ] Tailwind CSS v4 configured
- [ ] shadcn/ui initialized with stone color theme
- [ ] Project deployed to Vercel and accessible via URL
- [ ] Environment variables configured for dev and production
- [ ] Google Fonts configured: DM Sans (body) and Instrument Serif (display/headings)

### Non-Functional Requirements

- [ ] ESLint and Prettier configured
- [ ] Path aliases working (@/ for src/)
- [ ] .env.example file with all required variables documented
- [ ] .gitignore properly configured (node_modules, .next, .env.local, etc.)
- [ ] Vercel Ignored Build Step configured to skip deployments for non-frontend changes

## Dependencies

- **Sprints**: None (this is the first sprint)
- **External**: Vercel account (user has one), GitHub repo

## Scope

### In Scope

- Next.js 15 project scaffolding
- Tailwind CSS + shadcn/ui setup
- Font configuration (DM Sans, Instrument Serif)
- Vercel deployment
- ESLint/Prettier configuration
- Environment variable structure

### Out of Scope

- Database setup (Sprint 2)
- Authentication (Sprint 2)
- UI components beyond shadcn/ui base (Sprint 3)
- Any feature functionality

## Technical Approach

1. Initialize Next.js 15 with `create-next-app` using App Router and TypeScript
2. Install and configure Tailwind CSS
3. Initialize shadcn/ui with `npx shadcn@latest init` - use stone theme
4. Configure fonts via `next/font/google` (DM Sans, Instrument Serif)
5. Set up path aliases in tsconfig.json
6. Create `.env.example` and `.env.local` templates
7. Configure Vercel deployment
8. Set up ESLint + Prettier with consistent rules
9. Create Vercel Ignored Build Step script to prevent unnecessary deployments

## Tasks

### Phase 1: Planning
- [ ] Review existing project structure (may already have a Next.js skeleton)
- [ ] Determine if we're starting fresh or building on existing scaffold

### Phase 2: Implementation
- [ ] Create/configure Next.js 15 App Router project
- [ ] Install and configure Tailwind CSS v4
- [ ] Initialize shadcn/ui with stone color palette
- [ ] Configure Google Fonts (DM Sans body, Instrument Serif headings)
- [ ] Set up ESLint and Prettier
- [ ] Create .env.example with documented variables
- [ ] Create basic app/layout.tsx with font providers
- [ ] Create basic app/page.tsx with a "Hello Inkfluence" placeholder
- [ ] Create `scripts/vercel-ignore-build.sh` — Vercel Ignored Build Step script
- [ ] Configure Vercel project to use the ignore script

### Vercel Ignored Build Step

Create `scripts/vercel-ignore-build.sh` that Vercel runs before each build. The script checks which files changed in the commit. If ONLY non-deployment files changed, it exits 0 (skip build). If deployment-relevant files changed, it exits 1 (proceed with build).

**Files that SKIP deployment (exit 0):**
- `docs/**` — sprint files, documentation
- `tests/**`, `__tests__/**` — test files
- `scripts/**` (except vercel-ignore-build.sh itself)
- `*.md` — README, changelogs, sprint specs
- `.claude/**` — workflow state files
- `docker-compose.yml`, `Dockerfile`, `.dockerignore`
- `.env.example`, `.env.docker`
- `drizzle/**` — migration files only (schema changes need deploy)
- `.github/**` — CI/CD configs
- `*.test.*`, `*.spec.*` — test files anywhere

**Files that TRIGGER deployment (exit 1):**
- `src/**` — all source code (components, pages, API routes, libs)
- `public/**` — static assets
- `package.json`, `pnpm-lock.yaml` — dependency changes
- `next.config.*` — Next.js config
- `tailwind.config.*` — Tailwind config
- `tsconfig.json` — TypeScript config
- `postcss.config.*` — PostCSS config

**Vercel configuration:**
In Vercel Project Settings → Git → Ignored Build Step, set:
```
bash scripts/vercel-ignore-build.sh
```

### Phase 3: Validation
- [ ] `pnpm dev` runs without errors
- [ ] `pnpm build` completes successfully
- [ ] Vercel deployment succeeds
- [ ] Fonts render correctly in browser
- [ ] shadcn/ui components render with stone theme

### Phase 4: Documentation
- [ ] Update README.md with setup instructions
- [ ] Document environment variables in .env.example

## Acceptance Criteria

- [ ] `pnpm dev` starts the dev server without errors
- [ ] `pnpm build` completes without TypeScript or build errors
- [ ] App is deployed and accessible on Vercel
- [ ] DM Sans renders as body font, Instrument Serif as display font
- [ ] shadcn/ui Button component renders with stone color palette
- [ ] ESLint passes with no errors
- [ ] All code is TypeScript (no .js files except config)
- [ ] Vercel Ignored Build Step configured and tested
- [ ] Pushing changes to only `docs/` does NOT trigger a Vercel build
- [ ] Pushing changes to `src/` DOES trigger a Vercel build

## Open Questions

- Does the user already have a Vercel project linked to this repo?
- Is pnpm the preferred package manager? (existing project uses pnpm)

## Notes

Reference wireframe file: /Users/chrishobbs/Downloads/inkfluence-ai-hifi-wireframes.jsx
The wireframes show: stone color palette, DM Sans body font, Instrument Serif for headings, shadcn/ui components.
