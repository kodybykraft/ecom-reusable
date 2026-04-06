import { eq, desc, sql } from 'drizzle-orm';
import { categories, collections } from '@ecom/db';
import type { Database } from '@ecom/db';
import type { PaginationInput } from '@ecom/core';
import { NotFoundError, slugify } from '@ecom/core';

export class CategoryService {
  constructor(private db: Database) {}

  // --- Categories ---

  async listCategories(pagination?: PaginationInput) {
    const page = pagination?.page ?? 1;
    const pageSize = pagination?.pageSize ?? 20;
    const offset = (page - 1) * pageSize;

    const [data, countResult] = await Promise.all([
      this.db.query.categories.findMany({
        limit: pageSize,
        offset,
        orderBy: desc(categories.position),
      }),
      this.db.select({ count: sql<number>`count(*)` }).from(categories),
    ]);

    const total = Number(countResult[0].count);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async getCategoryById(id: string) {
    const category = await this.db.query.categories.findFirst({
      where: eq(categories.id, id),
    });
    if (!category) throw new NotFoundError('Category', id);
    return category;
  }

  async createCategory(input: {
    name: string;
    slug?: string;
    description?: string;
    parentId?: string;
    position?: number;
  }) {
    const [category] = await this.db
      .insert(categories)
      .values({
        name: input.name,
        slug: input.slug ?? slugify(input.name),
        description: input.description ?? null,
        parentId: input.parentId ?? null,
        position: input.position ?? 0,
      })
      .returning();

    return category;
  }

  async updateCategory(
    id: string,
    data: Partial<{ name: string; slug: string; description: string; parentId: string; position: number }>,
  ) {
    await this.getCategoryById(id);
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.parentId !== undefined) updateData.parentId = data.parentId;
    if (data.position !== undefined) updateData.position = data.position;

    await this.db.update(categories).set(updateData).where(eq(categories.id, id));
    return this.getCategoryById(id);
  }

  async deleteCategory(id: string) {
    await this.getCategoryById(id);
    await this.db.delete(categories).where(eq(categories.id, id));
  }

  // --- Collections ---

  async listCollections(pagination?: PaginationInput) {
    const page = pagination?.page ?? 1;
    const pageSize = pagination?.pageSize ?? 20;
    const offset = (page - 1) * pageSize;

    const [data, countResult] = await Promise.all([
      this.db.query.collections.findMany({
        limit: pageSize,
        offset,
        orderBy: desc(collections.createdAt),
      }),
      this.db.select({ count: sql<number>`count(*)` }).from(collections),
    ]);

    const total = Number(countResult[0].count);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async getCollectionById(id: string) {
    const collection = await this.db.query.collections.findFirst({
      where: eq(collections.id, id),
    });
    if (!collection) throw new NotFoundError('Collection', id);
    return collection;
  }

  async createCollection(input: {
    title: string;
    slug?: string;
    description?: string;
    type?: string;
    rules?: unknown;
  }) {
    const [collection] = await this.db
      .insert(collections)
      .values({
        title: input.title,
        slug: input.slug ?? slugify(input.title),
        description: input.description ?? null,
        type: input.type ?? 'manual',
        rules: input.rules ?? null,
      })
      .returning();

    return collection;
  }

  async updateCollection(
    id: string,
    data: Partial<{ title: string; slug: string; description: string; type: string; rules: unknown }>,
  ) {
    await this.getCollectionById(id);
    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.rules !== undefined) updateData.rules = data.rules;

    await this.db.update(collections).set(updateData).where(eq(collections.id, id));
    return this.getCollectionById(id);
  }

  async deleteCollection(id: string) {
    await this.getCollectionById(id);
    await this.db.delete(collections).where(eq(collections.id, id));
  }
}
