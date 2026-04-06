#!/usr/bin/env node

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const CYAN = '\x1b[36m';
const GREEN = '\x1b[32m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

function log(msg: string) {
  console.log(msg);
}

function success(msg: string) {
  console.log(`${GREEN}  done${RESET} ${msg}`);
}

function writeIfMissing(filePath: string, content: string, label: string): boolean {
  if (existsSync(filePath)) {
    console.log(`${DIM}  skip${RESET} ${label} (already exists)`);
    return false;
  }
  const dir = filePath.substring(0, filePath.lastIndexOf('/'));
  mkdirSync(dir, { recursive: true });
  writeFileSync(filePath, content, 'utf-8');
  success(label);
  return true;
}

// ---------------------------------------------------------------------------
// File templates
// ---------------------------------------------------------------------------

const ECOM_INIT = `import { createEcom } from '@ecom/next';

export const ecom = createEcom({
  databaseUrl: process.env.DATABASE_URL!,
});
`;

const ROUTE_HANDLER = `import { createEcomRouteHandler } from '@ecom/next';
import '../../../lib/ecom';

export const dynamic = 'force-dynamic';
export const { GET, POST, PATCH, DELETE } = createEcomRouteHandler();
`;

const MIDDLEWARE = `import { createEcomMiddleware } from '@ecom/next';

export default createEcomMiddleware();

export const config = {
  matcher: ['/admin/:path*', '/api/ecom/admin/:path*'],
};
`;

const ENV_EXAMPLE = `# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mystore

# Optional — Stripe
# STRIPE_SECRET_KEY=sk_test_...
# STRIPE_WEBHOOK_SECRET=whsec_...

# Optional — AWS SES (email marketing)
# AWS_SES_REGION=us-east-1
# AWS_SES_FROM_EMAIL=noreply@yourstore.com
`;

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const targetDir = resolve(process.argv[2] || '.');

  log('');
  log(`${BOLD}${CYAN}@ecom${RESET}${BOLD} — Setting up e-commerce integration${RESET}`);
  log('');

  let created = 0;

  // lib/ecom.ts
  created += writeIfMissing(
    join(targetDir, 'src/lib/ecom.ts'),
    ECOM_INIT,
    'src/lib/ecom.ts',
  ) ? 1 : 0;

  // API route
  created += writeIfMissing(
    join(targetDir, 'src/app/api/[...ecom]/route.ts'),
    ROUTE_HANDLER,
    'src/app/api/[...ecom]/route.ts',
  ) ? 1 : 0;

  // Middleware
  created += writeIfMissing(
    join(targetDir, 'src/middleware.ts'),
    MIDDLEWARE,
    'src/middleware.ts',
  ) ? 1 : 0;

  // .env.example
  created += writeIfMissing(
    join(targetDir, '.env.example'),
    ENV_EXAMPLE,
    '.env.example',
  ) ? 1 : 0;

  log('');

  if (created > 0) {
    log(`${BOLD}Next steps:${RESET}`);
    log('');
    log(`  1. Copy ${CYAN}.env.example${RESET} to ${CYAN}.env${RESET} and add your DATABASE_URL`);
    log(`  2. Run ${CYAN}npx drizzle-kit push${RESET} to create database tables`);
    log(`  3. Run ${CYAN}npm run dev${RESET} and visit ${CYAN}/api/ecom/products${RESET}`);
    log('');
    log(`  For the admin dashboard, copy the admin pages from the demo app:`);
    log(`  ${DIM}https://github.com/your-org/ecom-reusable/tree/main/apps/demo/src/app/admin${RESET}`);
  } else {
    log(`  All files already exist. Nothing to do.`);
  }

  log('');
}

main();
