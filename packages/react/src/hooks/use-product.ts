import { useState, useEffect, useCallback } from 'react';
import { useEcom } from '../context/ecom-context.js';

interface Product {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  status: string;
  variants: Array<{
    id: string;
    title: string;
    price: number;
    compareAtPrice: number | null;
    inventoryQuantity: number;
    sku: string | null;
    options: Record<string, string>;
  }>;
  images: Array<{ id: string; url: string; altText: string | null; position: number }>;
  options: Array<{ id: string; name: string; values: string[] }>;
}

export function useProduct(slug: string) {
  const { fetcher } = useEcom();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher<Product>(`/products/${slug}`);
      setProduct(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch product'));
    } finally {
      setLoading(false);
    }
  }, [fetcher, slug]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { product, loading, error, refetch: fetchProduct };
}
