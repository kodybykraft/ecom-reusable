import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const monorepo = resolve(__dirname, '../../..');

const { createDb, products } = await import(resolve(monorepo, 'packages/db/dist/index.js'));
const { eq } = await import('drizzle-orm');

const db = createDb(process.env.DATABASE_URL);
await db.update(products).set({ status: 'archived' }).where(eq(products.slug, 'reflective-tracksuit'));
console.log('Reflective Tracksuit archived.');
process.exit(0);
