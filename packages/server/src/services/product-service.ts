import { eq, like, and, gte, lte, sql, desc, asc, inArray } from 'drizzle-orm';
import { products, productVariants, productImages, productOptions, productCategories, collectionProducts } from '@ecom/db';
import type { Database } from '@ecom/db';
import type { ProductFilter, PaginationInput, SortInput, CreateProductInput } from '@ecom/core';
import { NotFoundError, slugify, uniqueSlug, escapeLike } from '@ecom/core';
import { eventBus } from '../events/event-bus.js';

export class ProductService {
  constructor(private db: Database) {}

  async list(filter?: ProductFilter, pagination?: PaginationInput, sort?: SortInput) {
    const page = pagination?.page ?? 1;
    const pageSize = pagination?.pageSize ?? 20;
    const offset = (page - 1) * pageSize;

    const conditions = [];
    if (filter?.status) conditions.push(eq(products.status, filter.status));
    if (filter?.search) conditions.push(like(products.title, `%${escapeLike(filter.search)}%`));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      this.db.query.products.findMany({
        where,
        with: { variants: true, images: true },
        limit: pageSize,
        offset,
        orderBy: sort?.field === 'title'
          ? sort.direction === 'asc' ? asc(products.title) : desc(products.title)
          : desc(products.createdAt),
      }),
      this.db.select({ count: sql<number>`count(*)` }).from(products).where(where),
    ]);

    const total = Number(countResult[0].count);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async getById(id: string) {
    const product = await this.db.query.products.findFirst({
      where: eq(products.id, id),
      with: { variants: true, images: true, options: true },
    });
    if (!product) throw new NotFoundError('Product', id);
    return product;
  }

  async getBySlug(slug: string) {
    const product = await this.db.query.products.findFirst({
      where: eq(products.slug, slug),
      with: { variants: true, images: true, options: true },
    });
    if (!product) throw new NotFoundError('Product', slug);
    return product;
  }

  async create(input: CreateProductInput) {
    const slug = input.slug ? slugify(input.slug) : uniqueSlug(input.title);

    const [product] = await this.db
      .insert(products)
      .values({
        title: input.title,
        slug,
        description: input.description ?? null,
        status: input.status ?? 'draft',
        metadata: input.metadata ?? null,
      })
      .returning();

    if (input.variants?.length) {
      await this.db.insert(productVariants).values(
        input.variants.map((v, i) => ({
          productId: product.id,
          title: v.title,
          sku: v.sku ?? null,
          price: v.price,
          compareAtPrice: v.compareAtPrice ?? null,
          costPrice: v.costPrice ?? null,
          weight: v.weight ?? null,
          weightUnit: v.weightUnit ?? null,
          inventoryQuantity: v.inventoryQuantity ?? 0,
          barcode: v.barcode ?? null,
          position: i,
          options: v.options ?? {},
        })),
      );
    }

    if (input.options?.length) {
      await this.db.insert(productOptions).values(
        input.options.map((o, i) => ({
          productId: product.id,
          name: o.name,
          position: i,
          values: o.values,
        })),
      );
    }

    await eventBus.emit('product.created', { productId: product.id });
    return this.getById(product.id);
  }

  async update(id: string, data: Partial<CreateProductInput>) {
    const existing = await this.getById(id);

    await this.db
      .update(products)
      .set({
        ...(data.title && { title: data.title }),
        ...(data.slug && { slug: slugify(data.slug) }),
        ...(data.description !== undefined && { description: data.description ?? null }),
        ...(data.status && { status: data.status }),
        ...(data.metadata !== undefined && { metadata: data.metadata ?? null }),
      })
      .where(eq(products.id, id));

    await eventBus.emit('product.updated', { productId: id });
    return this.getById(id);
  }

  async delete(id: string) {
    await this.getById(id); // ensure exists
    await this.db.delete(products).where(eq(products.id, id));
    await eventBus.emit('product.deleted', { productId: id });
  }

  // ---------------------------------------------------------------------------
  // Variants CRUD
  // ---------------------------------------------------------------------------

  async createVariant(productId: string, input: {
    title: string;
    sku?: string | null;
    price: number;
    compareAtPrice?: number | null;
    costPrice?: number | null;
    weight?: number | null;
    weightUnit?: string | null;
    inventoryQuantity?: number;
    barcode?: string | null;
    options?: Record<string, string>;
  }) {
    await this.getById(productId);

    // Position = max existing position + 1
    const existing = await this.db.query.productVariants.findMany({
      where: eq(productVariants.productId, productId),
    });
    const nextPosition = existing.length
      ? Math.max(...existing.map((v) => v.position ?? 0)) + 1
      : 0;

    const [variant] = await this.db
      .insert(productVariants)
      .values({
        productId,
        title: input.title,
        sku: input.sku ?? null,
        price: input.price,
        compareAtPrice: input.compareAtPrice ?? null,
        costPrice: input.costPrice ?? null,
        weight: input.weight ?? null,
        weightUnit: input.weightUnit ?? null,
        inventoryQuantity: input.inventoryQuantity ?? 0,
        barcode: input.barcode ?? null,
        position: nextPosition,
        options: input.options ?? {},
      })
      .returning();

    await eventBus.emit('product.updated', { productId });
    return variant;
  }

  async updateVariant(variantId: string, data: {
    title?: string;
    sku?: string | null;
    price?: number;
    compareAtPrice?: number | null;
    costPrice?: number | null;
    weight?: number | null;
    weightUnit?: string | null;
    inventoryQuantity?: number;
    barcode?: string | null;
    options?: Record<string, string>;
  }) {
    const existing = await this.db.query.productVariants.findFirst({
      where: eq(productVariants.id, variantId),
    });
    if (!existing) throw new NotFoundError('ProductVariant', variantId);

    const update: Record<string, unknown> = {};
    if (data.title !== undefined) update.title = data.title;
    if (data.sku !== undefined) update.sku = data.sku;
    if (data.price !== undefined) update.price = data.price;
    if (data.compareAtPrice !== undefined) update.compareAtPrice = data.compareAtPrice;
    if (data.costPrice !== undefined) update.costPrice = data.costPrice;
    if (data.weight !== undefined) update.weight = data.weight;
    if (data.weightUnit !== undefined) update.weightUnit = data.weightUnit;
    if (data.inventoryQuantity !== undefined) update.inventoryQuantity = data.inventoryQuantity;
    if (data.barcode !== undefined) update.barcode = data.barcode;
    if (data.options !== undefined) update.options = data.options;

    const [updated] = await this.db
      .update(productVariants)
      .set(update)
      .where(eq(productVariants.id, variantId))
      .returning();

    await eventBus.emit('product.updated', { productId: existing.productId });
    return updated;
  }

  async deleteVariant(variantId: string) {
    const existing = await this.db.query.productVariants.findFirst({
      where: eq(productVariants.id, variantId),
    });
    if (!existing) throw new NotFoundError('ProductVariant', variantId);

    await this.db.delete(productVariants).where(eq(productVariants.id, variantId));
    await eventBus.emit('product.updated', { productId: existing.productId });
  }
}
