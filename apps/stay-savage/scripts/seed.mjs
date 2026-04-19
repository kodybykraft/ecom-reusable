/**
 * Stay Savage — Product Seed Script
 * Uses @ecom/server + @ecom/db directly (no Next.js dependency)
 * Run: node scripts/seed.mjs
 */

import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const monorepo = resolve(__dirname, '../../..');

// Import compiled packages directly
const dbMod = await import(resolve(monorepo, 'packages/db/dist/index.js'));
const { productImages, inventoryLocations, inventoryLevels } = dbMod;
const { createDb } = dbMod;

const db = createDb(process.env.DATABASE_URL);

// Import ProductService - need to do it carefully to avoid pulling in all services
const { ProductService } = await import(resolve(monorepo, 'packages/server/dist/services/product-service.js'));
const productService = new ProductService(db);

const STOCK = { S: 5, M: 10, L: 10, XL: 10, XXL: 5 };
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

async function seed() {
  console.log('Seeding Stay Savage products...\n');

  // 1. Create inventory location
  const [location] = await db.insert(inventoryLocations).values({
    name: 'Stay Savage Warehouse',
    address: { line1: '118 Plashet Road', city: 'London', postcode: 'E13 0QS', country: 'GB' },
    isDefault: true,
    isActive: true,
  }).returning();
  console.log(`Location: ${location.name} (${location.id})`);

  // ── Reflective Tracksuit ──
  const reflective = await productService.create({
    title: 'Reflective Tracksuit',
    slug: 'reflective-tracksuit',
    description: 'Born in the Dark, Seen by Light. 330 GSM heavyweight fleece with reflective Stay Savage print. 80% Ringspun Combed Cotton / 20% Polyester. Boxy oversized top with tapered joggers.',
    status: 'active',
    metadata: {
      collection: 'reflective',
      fabric: '80% Ringspun Combed Cotton / 20% Polyester',
      weight: '330 GSM',
      fit: 'Boxy Oversized (Top) / Tapered Joggers',
      features: ['Reflective Stay Savage logo', 'Heavy structured fit with soft interior', 'Ringspun combed cotton-poly fleece', 'Ribbed cuffs and hem', 'Front pouch pocket'],
    },
    options: [{ name: 'Size', values: SIZES }],
    variants: SIZES.map(size => ({
      title: `Jet Black / ${size}`,
      sku: `SS-REF-BLK-${size}`,
      price: 12000,
      inventoryQuantity: STOCK[size],
      weight: 1200,
      weightUnit: 'g',
      options: { Size: size, Color: 'Jet Black' },
    })),
  });
  console.log(`+ ${reflective.title}`);

  await db.insert(productImages).values([
    { productId: reflective.id, url: '/images/hero-reflective.jpg', altText: 'Reflective Tracksuit front', position: 0 },
    { productId: reflective.id, url: '/images/side-profile.jpg', altText: 'Reflective Tracksuit side', position: 1 },
    { productId: reflective.id, url: '/images/flatlay.jpg', altText: 'Reflective Tracksuit flat lay', position: 2 },
    { productId: reflective.id, url: '/images/lifestyle-workout.jpg', altText: 'Reflective Tracksuit workout', position: 3 },
    { productId: reflective.id, url: '/images/texture-closeup.jpg', altText: 'Reflective Tracksuit fabric', position: 4 },
  ]);

  // ── OG Tracksuits ──
  const ogColors = [
    { name: 'Black', slug: 'og-tracksuit-black', imgs: ['stay-savage---black-01.jpg', 'stay-savage---black-02.jpg', 'stay-savage---black-03.jpg', 'stay-savage---black-04.jpg'] },
    { name: 'Grey', slug: 'og-tracksuit-grey', imgs: ['stay-savage---grey-01.jpg', 'stay-savage---grey-02.jpg', 'stay-savage---grey-03.jpg', 'stay-savage---grey-04.jpg'] },
    { name: 'Olive', slug: 'og-tracksuit-olive', imgs: ['stay-savage---khaki01.jpg', 'stay-savage---khaki-02.jpg', 'stay-savage---khaki-03.jpg', 'stay-savage---khaki-05.jpg'] },
    { name: 'Navy Blue', slug: 'og-tracksuit-navy', imgs: ['stay-savage---navy-blue-02.jpg', 'stay-savage---navy-blue-03.jpg', 'stay-savage---navy-blue-04.jpg', 'stay-savage---navy-blue-05.jpg'] },
  ];

  for (const color of ogColors) {
    const product = await productService.create({
      title: `OG Tracksuit — ${color.name}`,
      slug: color.slug,
      description: `Core Collection. 280 GSM heavyweight brushed fleece in ${color.name}. 80% Combed Ringspun Cotton / 20% Polyester. Drop shoulder fit with ribbed cuffs. Built for those who grind in silence.`,
      status: 'active',
      metadata: {
        collection: 'og',
        fabric: '80% Combed Ringspun Cotton / 20% Polyester',
        weight: '280 GSM',
        fit: 'Drop Shoulder / Ribbed Cuffs',
        color: color.name,
        features: ['Brushed fleece interior', 'Heat-pressed Stay Savage logo', 'Front pouch + side zip pockets', 'Ribbed cuffs and waistband'],
      },
      options: [{ name: 'Size', values: SIZES }],
      variants: SIZES.map(size => ({
        title: `${color.name} / ${size}`,
        sku: `SS-OG-${color.name.toUpperCase().replace(' ', '')}-${size}`,
        price: 10000,
        inventoryQuantity: STOCK[size],
        weight: 1000,
        weightUnit: 'g',
        options: { Size: size, Color: color.name },
      })),
    });

    await db.insert(productImages).values(
      color.imgs.map((img, i) => ({
        productId: product.id,
        url: `/images/products/${img}`,
        altText: `OG Tracksuit ${color.name} view ${i + 1}`,
        position: i,
      })),
    );
    console.log(`+ ${product.title}`);
  }

  // ── Set inventory levels at warehouse ──
  console.log('\nSetting inventory...');
  const all = await productService.list({ status: 'active' }, { pageSize: 10 });

  for (const p of all.data) {
    for (const v of p.variants) {
      const qty = v.inventoryQuantity || 0;
      if (qty > 0) {
        await db.insert(inventoryLevels).values({
          locationId: location.id,
          variantId: v.id,
          available: qty,
          committed: 0,
          incoming: 0,
        }).onConflictDoNothing();
      }
    }
  }

  const totalUnits = all.data.reduce((s, p) => s + p.variants.reduce((vs, v) => vs + (v.inventoryQuantity || 0), 0), 0);
  console.log(`\nDone! ${all.total} products, ${totalUnits} units.\n`);
  process.exit(0);
}

seed().catch(err => { console.error('Seed failed:', err); process.exit(1); });
