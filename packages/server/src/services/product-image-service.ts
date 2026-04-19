import { eq, sql } from 'drizzle-orm';
import { productImages } from '@ecom/db';
import type { Database } from '@ecom/db';
import { NotFoundError } from '@ecom/core';

// Minimal StorageProvider shape — keeps @ecom/server free of direct
// dependency on @ecom/integrations. The caller injects any implementation
// that matches this contract.
export interface StorageLike {
  upload(input: { body: Uint8Array | Buffer | Blob | ArrayBuffer; key: string; contentType?: string }): Promise<{ url: string; key: string }>;
  delete(key: string): Promise<void>;
}

export class ProductImageService {
  constructor(private db: Database, private storage?: StorageLike) {}

  async list(productId: string) {
    return this.db.query.productImages.findMany({
      where: eq(productImages.productId, productId),
      orderBy: (i, { asc }) => [asc(i.position)],
    });
  }

  async getById(id: string) {
    const image = await this.db.query.productImages.findFirst({
      where: eq(productImages.id, id),
    });
    if (!image) throw new NotFoundError('ProductImage', id);
    return image;
  }

  /**
   * Upload a new image to storage and create a product_images row.
   * Caller provides the product ID and image bytes.
   */
  async upload(input: {
    productId: string;
    fileName: string;
    body: Uint8Array | Buffer | ArrayBuffer;
    contentType?: string;
    altText?: string;
  }) {
    if (!this.storage) {
      throw new Error('Storage provider is not configured. Set R2 env vars and pass storage to ProductImageService.');
    }

    // Derive a safe, unique object key
    const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();
    const key = `products/${input.productId}/${Date.now()}-${safeName}`;

    const uploaded = await this.storage.upload({
      body: input.body,
      key,
      contentType: input.contentType,
    });

    // Position = max existing + 1
    const [{ nextPos }] = await this.db
      .select({ nextPos: sql<number>`coalesce(max(${productImages.position}), -1) + 1` })
      .from(productImages)
      .where(eq(productImages.productId, input.productId));

    const [row] = await this.db
      .insert(productImages)
      .values({
        productId: input.productId,
        url: uploaded.url,
        storageKey: uploaded.key,
        altText: input.altText ?? null,
        position: Number(nextPos) || 0,
      })
      .returning();

    return row;
  }

  /**
   * Create a product_images row from an already-hosted URL (bypassing storage).
   * Useful for seed data or external image hosts.
   */
  async addByUrl(input: {
    productId: string;
    url: string;
    altText?: string;
    position?: number;
  }) {
    const [row] = await this.db
      .insert(productImages)
      .values({
        productId: input.productId,
        url: input.url,
        altText: input.altText ?? null,
        position: input.position ?? 0,
      })
      .returning();
    return row;
  }

  async delete(id: string) {
    const image = await this.getById(id);
    if (image.storageKey && this.storage) {
      try {
        await this.storage.delete(image.storageKey);
      } catch {
        // Ignore storage delete failure — still remove DB row
      }
    }
    await this.db.delete(productImages).where(eq(productImages.id, id));
  }

  async reorder(productId: string, orderedIds: string[]) {
    for (let i = 0; i < orderedIds.length; i++) {
      await this.db
        .update(productImages)
        .set({ position: i })
        .where(eq(productImages.id, orderedIds[i]));
    }
    return this.list(productId);
  }
}
