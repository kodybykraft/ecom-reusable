/**
 * Create admin account for Stay Savage
 * Uses PBKDF2-SHA256 hashing (matching AuthService.verifyPassword)
 * Run: node scripts/create-admin.mjs
 */

import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const monorepo = resolve(__dirname, '../../..');

const { createDb } = await import(resolve(monorepo, 'packages/db/dist/index.js'));
const { users } = await import(resolve(monorepo, 'packages/db/dist/schema/index.js'));

const db = createDb(process.env.DATABASE_URL);

// PBKDF2 hashing — must match packages/server/src/auth/auth-service.ts
function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hashPassword(password) {
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const derived = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 600_000, hash: 'SHA-256' },
    keyMaterial,
    256,
  );
  return `${toHex(salt.buffer)}:${toHex(derived)}`;
}

const email = 'apex.staysavage@gmail.com';
const password = 'WolveseatFirst8!';

try {
  const passwordHash = await hashPassword(password);
  const [admin] = await db.insert(users).values({
    email,
    passwordHash,
    firstName: 'Stay Savage',
    lastName: 'Admin',
    role: 'admin',
  }).onConflictDoNothing().returning();

  if (admin) {
    console.log(`Admin created: ${admin.email} (${admin.id})`);
  } else {
    console.log('Admin already exists — updating password hash...');
    const { eq } = await import('drizzle-orm');
    await db.update(users).set({ passwordHash }).where(eq(users.email, email));
    console.log('Password hash updated.');
  }
} catch (err) {
  console.error('Failed:', err.message);
}

process.exit(0);
