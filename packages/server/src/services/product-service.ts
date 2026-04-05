import { eq, like, and, gte, lte, sql, desc, asc, inArray } from 'drizzle-orm';
import { products, productVariants, productImages, productOptions, productCategories, collectionProducts } from '@ecom/db';
import type { Database } from '@ecom/db';
import type { ProductFilter, PaginationInput, SortInput, CreateProductInput } from '@ecom/core';
import { NotFoundError, slugify, uniqueSlug } from '@ecom/core';
import { eventBus } from '../events/event-bus.js';

export class ProductService {
  constructor(private db: Database) {}

  async list(filter?: ProductFilter, pagination?: PaginationInput, sort?: SortInput) {
    const page = pagination?.page ?? 1;
    const pageSize = pagination?.pageSize ?? 20;
    const offset = (page - 1) * pageSize;

    const conditions = [];
    if (filter?.status) conditions.push(eq(products.status, filter.status));
    if (filter?.search) conditions.push(like(products.title, `%${filter.search}%`));

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
}
