# E-Com Reusable Platform

## What This Is
A plug-in ecommerce platform core for Next.js/React with reusable operations dashboard, analytics engine, and SES-based lifecycle marketing.

## Architecture
- **Monorepo**: pnpm workspaces + Turborepo
- **10 packages**: core, db, server, react, next, admin, analytics, email, integrations, ui
- **1 demo app**: apps/demo (Next.js 15)

## Key Conventions
- **Money**: Always integer cents. Use `@ecom/core/utils/money.ts` for formatting.
- **Pure core**: `@ecom/core` has ZERO external dependencies. Pure functions and types only.
- **Provider pattern**: All external services implement typed interfaces in `@ecom/integrations`.
- **Event-driven**: Domain events through EventBus. Webhooks, analytics, emails react to events.
- **Database**: PostgreSQL + Drizzle ORM. Schema in `packages/db/src/schema/`.

## Package Dependencies
```
@ecom/core          → (none)
@ecom/db            → core
@ecom/server        → core, db, integrations
@ecom/react         → core
@ecom/next          → core, server
@ecom/integrations  → core
@ecom/analytics     → core, db
@ecom/email         → core, db, integrations
@ecom/ui            → (none)
@ecom/admin         → core, ui, react
```

## Commands
- `pnpm install` — install all deps
- `pnpm build` — build all packages
- `pnpm dev` — start dev servers
- `pnpm typecheck` — type-check all packages
- `pnpm test` — run all tests
- `pnpm db:push` — push schema to database
- `pnpm db:seed` — seed dev data

## Excluded from Scope
- No blog engine
- No CMS/page builder
- No theme system
- No POS
- No marketplace sync

<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
|------|----------|
| `detect_changes` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context` | Need source snippets for review — token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.
