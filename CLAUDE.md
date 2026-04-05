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
