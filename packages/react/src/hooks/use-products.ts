import { useState, useEffect, useCallback } from 'react';
import { useEcom } from '../context/ecom-context.js';

interface ProductListItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  status: string;
  variants: Array<{ id: string; title: string; price: number; compareAtPrice: number | null; inventoryQuantity: number }>;
  images: Array<{ id: string; url: string; altText: string | null; position: number }>;
}

interface ProductsResult {
  data: ProductListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function useProducts(params?: {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  const { fetcher } = useEcom();
  const [data, setData] = useState<ProductsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.set('search', params.search);
      if (params?.status) searchParams.set('status', params.status);
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.pageSize) searchParams.set('pageSize', String(params.pageSize));
      const qs = searchParams.toString();
      const result = await fetcher<ProductsResult>(`/products${qs ? `?${qs}` : ''}`);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch products'));
    } finally {
      setLoading(false);
    }
  }, [fetcher, params?.search, params?.status, params?.page, params?.pageSize]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { ...data, loading, error, refetch: fetchProducts };
}
