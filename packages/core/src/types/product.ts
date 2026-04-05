import type { Money, ProductStatus, WeightUnit } from './common.js';

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  status: ProductStatus;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
  variants?: ProductVariant[];
  images?: ProductImage[];
  options?: ProductOption[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string | null;
  title: string;
  price: Money;
  compareAtPrice: Money | null;
  costPrice: Money | null;
  weight: number | null;
  weightUnit: WeightUnit | null;
  inventoryQuantity: number;
  barcode: string | null;
  position: number;
  options: Record<string, string>;
}

export interface ProductImage {
  id: string;
  productId: string;
  variantId: string | null;
  url: string;
  altText: string | null;
  position: number;
}

export interface ProductOption {
  id: string;
  productId: string;
  name: string;
  position: number;
  values: string[];
}

export interface CreateProductInput {
  title: string;
  slug?: string;
  description?: string;
  status?: ProductStatus;
  metadata?: Record<string, unknown>;
  variants?: CreateVariantInput[];
  options?: CreateOptionInput[];
}

export interface CreateVariantInput {
  sku?: string;
  title: string;
  price: Money;
  compareAtPrice?: Money;
  costPrice?: Money;
  weight?: number;
  weightUnit?: WeightUnit;
  inventoryQuantity?: number;
  barcode?: string;
  options?: Record<string, string>;
}

export interface CreateOptionInput {
  name: string;
  values: string[];
}

export interface ProductFilter {
  status?: ProductStatus;
  search?: string;
  categoryId?: string;
  collectionId?: string;
  minPrice?: Money;
  maxPrice?: Money;
}
