import { getEcom } from '../create-ecom.js';
import type { ProductFilter, PaginationInput, SortInput } from '@ecom/core';

export async function getProducts(filter?: ProductFilter, pagination?: PaginationInput, sort?: SortInput) {
  const ecom = getEcom();
  return ecom.products.list(filter, pagination, sort);
}

export async function getProduct(slug: string) {
  const ecom = getEcom();
  return ecom.products.getBySlug(slug);
}

export async function getProductById(id: string) {
  const ecom = getEcom();
  return ecom.products.getById(id);
}
