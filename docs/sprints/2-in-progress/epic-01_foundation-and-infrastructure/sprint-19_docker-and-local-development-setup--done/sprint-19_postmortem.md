# Sprint 19 Postmortem: Docker and Local Development Setup

## Metrics

| Metric | Value |
|--------|-------|
| Sprint Number | 19 |
| Started | 2026-02-13T14:45:00Z |
| Completed | 2026-02-13T15:00:00Z |
| Duration | ~0.5 hours |
| Steps Completed | 13 |
| Files Changed | 9 files, 425 insertions, 1 deletion |
| Tests Added | 4 (driver switching tests) |
| Total Tests | 40/40 passing (zero regressions) |

## What Went Well

- Dual database driver approach (Neon + postgres.js) was clean and non-breaking
- Test-first approach caught the driver switching logic early
- Multi-stage Dockerfile provides both dev and production paths
- All 40 existing tests continued to pass with zero regressions
- The Drizzle ORM PgDatabase base type made the driver abstraction seamless

## What Could Improve

- Sprint file was a blank template when started; requirements had to be derived from CLAUDE.md and project context
- The sprint lifecycle script initially couldn't find the sprint file due to path resolution (needed manual debugging)
- Could have pinned pnpm version in Dockerfile instead of using `pnpm@latest`

## Blockers Encountered

- Sprint lifecycle `start-sprint` command failed initially with "Sprint 19 not found" despite the file existing in the expected location. Required manual Python debugging to determine it was a runtime issue vs path issue. Dry-run worked; second real attempt succeeded.
- Pre-existing TypeScript error in `webhook.test.ts` (Sprint 2 code) — not our issue but worth noting

## Technical Insights

- `@neondatabase/serverless` uses HTTP-based queries that cannot connect to standard PostgreSQL. This is the key reason the dual driver approach was necessary.
- Both `NeonHttpDatabase` and `PostgresJsDatabase` extend `PgDatabase` from `drizzle-orm/pg-core`, so the query API (select, insert, update, delete) is identical across drivers.
- Next.js `output: "standalone"` creates nested paths mirroring the filesystem structure. The production Dockerfile stage needs `COPY .next/standalone/app ./` (not `standalone/`) when WORKDIR is `/app`.
- Docker volume mounts: anonymous volumes for `node_modules` and `.next` prevent host overriding container-installed deps (platform mismatch prevention on macOS).

## Process Insights

- Infrastructure sprints benefit from being self-contained — this sprint touched minimal source code (only `db/index.ts` and `next.config.ts`)
- The Vercel ignore-build script already handled Docker files, showing good foresight from Sprint 1
- Test-first for the driver switching logic was the right call — it validated the approach before creating Docker files

## Patterns Discovered

```typescript
// Environment-based driver switching with shared type
type Database = PgDatabase<PgQueryResultHKT, typeof schema>;

if (usePostgresJs()) {
  const client = postgres(url);
  _db = drizzlePostgres(client, { schema }) as unknown as Database;
} else {
  const sql = neon(url);
  _db = drizzleNeon(sql, { schema }) as unknown as Database;
}
```

This pattern allows transparent switching between database drivers while maintaining type safety for consumers. The `as unknown as Database` cast is safe because both drivers expose identical query APIs through the `PgDatabase` base class.

## Action Items for Next Sprint

- [ ] Pin pnpm version in Dockerfile for reproducible builds
- [ ] Add Clerk test keys to `.env.docker` when available for auth testing in Docker
- [ ] Consider adding a `docker compose exec` script for running commands inside the container
- [ ] Validate Docker setup end-to-end once Docker Desktop is confirmed on dev machines

## Notes

- Team: Dev Team 2
- This sprint was infrastructure-only (Epic 1: Foundation and Infrastructure)
- The `.env.docker` file is committed with placeholder keys — replace Clerk/Anthropic keys for full feature testing
- Production Docker stage exists but is not the primary deliverable; dev stage with hot reload is the focus
