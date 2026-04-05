import { createDb } from './client.js';
import {
  products, productVariants, productImages, productOptions,
  categories, productCategories,
  customers, customerAddresses,
  shippingZones, shippingRates,
  taxRates, storeSettings,
} from './schema/index.js';

async function seed() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }

  const db = createDb(databaseUrl);
  console.log('Seeding database...');

  // Categories
  const [apparel] = await db.insert(categories).values([
    { slug: 'apparel', name: 'Apparel', position: 0 },
    { slug: 'accessories', name: 'Accessories', position: 1 },
    { slug: 'footwear', name: 'Footwear', position: 2 },
  ]).returning();

  // Products
  const sampleProducts = [
    { title: 'Classic Cotton T-Shirt', slug: 'classic-cotton-tshirt', description: 'A comfortable everyday cotton tee in multiple colors.', status: 'active' },
    { title: 'Slim Fit Jeans', slug: 'slim-fit-jeans', description: 'Modern slim fit jeans with stretch comfort.', status: 'active' },
    { title: 'Leather Belt', slug: 'leather-belt', description: 'Genuine leather belt with brushed metal buckle.', status: 'active' },
    { title: 'Canvas Sneakers', slug: 'canvas-sneakers', description: 'Lightweight canvas sneakers for everyday wear.', status: 'active' },
    { title: 'Wool Beanie', slug: 'wool-beanie', description: 'Soft merino wool beanie for cold days.', status: 'active' },
    { title: 'Hooded Sweatshirt', slug: 'hooded-sweatshirt', description: 'Cozy fleece-lined hoodie with kangaroo pocket.', status: 'active' },
  ];

  const insertedProducts = await db.insert(products).values(sampleProducts).returning();

  // Variants for each product
  for (const product of insertedProducts) {
    const sizes = ['S', 'M', 'L', 'XL'];
    const basePrice = 1999 + Math.floor(Math.random() * 5000);

    await db.insert(productVariants).values(
      sizes.map((size, i) => ({
        productId: product.id,
        title: size,
        sku: `${product.slug}-${size.toLowerCase()}`,
        price: basePrice,
        compareAtPrice: basePrice + 1000,
        inventoryQuantity: 10 + Math.floor(Math.random() * 90),
        position: i,
        options: { Size: size },
      })),
    );

    await db.insert(productOptions).values({
      productId: product.id,
      name: 'Size',
      position: 0,
      values: sizes,
    });

    await db.insert(productImages).values({
      productId: product.id,
      url: `https://placehold.co/600x400/f5f5f5/666?text=${encodeURIComponent(product.title)}`,
      altText: product.title,
      position: 0,
    });

    // Assign to category
    if (apparel) {
      await db.insert(productCategories).values({
        productId: product.id,
        categoryId: apparel.id,
      });
    }
  }

  // Customers
  await db.insert(customers).values([
    { email: 'alice@example.com', firstName: 'Alice', lastName: 'Johnson', acceptsMarketing: true },
    { email: 'bob@example.com', firstName: 'Bob', lastName: 'Smith', acceptsMarketing: true },
    { email: 'carol@example.com', firstName: 'Carol', lastName: 'Williams', acceptsMarketing: false },
  ]);

  // Shipping zones
  const [domestic] = await db.insert(shippingZones).values([
    { name: 'Domestic', countries: ['US'], provinces: [] },
    { name: 'International', countries: [], provinces: [] },
  ]).returning();

  await db.insert(shippingRates).values([
    { zoneId: domestic.id, name: 'Standard Shipping', type: 'flat', price: 599 },
    { zoneId: domestic.id, name: 'Express Shipping', type: 'flat', price: 1299 },
  ]);

  // Tax rates
  await db.insert(taxRates).values([
    { name: 'US Sales Tax', rate: '0.08', country: 'US', province: null, priority: 0, isCompound: false, isShipping: false },
  ]);

  // Store settings
  await db.insert(storeSettings).values([
    { key: 'store_name', value: '"E-Com Demo Store"', group: 'general' },
    { key: 'currency', value: '"USD"', group: 'general' },
    { key: 'timezone', value: '"America/New_York"', group: 'general' },
  ]);

  console.log('Seed complete!');
  console.log(`  ${insertedProducts.length} products with variants`);
  console.log('  3 categories');
  console.log('  3 customers');
  console.log('  2 shipping zones with rates');
  console.log('  1 tax rate');
  console.log('  3 store settings');

  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
