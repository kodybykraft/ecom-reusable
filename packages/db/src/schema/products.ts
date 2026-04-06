import { pgTable, text, timestamp, jsonb, integer, varchar, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const products = pgTable(
  'ecom_products',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    status: varchar('status', { length: 20 }).notNull().default('draft'),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('ecom_products_slug_idx').on(table.slug),
    index('ecom_products_status_idx').on(table.status),
  ],
);

export const productVariants = pgTable(
  'ecom_product_variants',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    productId: text('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    sku: varchar('sku', { length: 100 }),
    title: varchar('title', { length: 255 }).notNull(),
    price: integer('price').notNull(), // cents
    compareAtPrice: integer('compare_at_price'),
    costPrice: integer('cost_price'),
    weight: integer('weight'),
    weightUnit: varchar('weight_unit', { length: 5 }),
    inventoryQuantity: integer('inventory_quantity').notNull().default(0),
    barcode: varchar('barcode', { length: 100 }),
    position: integer('position').notNull().default(0),
    options: jsonb('options').$type<Record<string, string>>().default({}),
  },
  (table) => [
    index('ecom_variants_product_id_idx').on(table.productId),
    index('ecom_variants_sku_idx').on(table.sku),
  ],
);

export const productImages = pgTable(
  'ecom_product_images',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    productId: text('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    variantId: text('variant_id').references(() => productVariants.id, { onDelete: 'set null' }),
    url: text('url').notNull(),
    altText: varchar('alt_text', { length: 255 }),
    position: integer('position').notNull().default(0),
  },
  (table) => [index('ecom_images_product_id_idx').on(table.productId)],
);

export const productOptions = pgTable('ecom_product_options', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  productId: text('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  position: integer('position').notNull().default(0),
  values: jsonb('values').$type<string[]>().notNull().default([]),
});

// Relations
export const productsRelations = relations(products, ({ many }) => ({
  variants: many(productVariants),
  images: many(productImages),
  options: many(productOptions),
}));

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const productOptionsRelations = relations(productOptions, ({ one }) => ({
  product: one(products, {
    fields: [productOptions.productId],
    references: [products.id],
  }),
}));
