'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAdminApi } from './use-admin-api';

export function useAdminProducts(
  apiBase: string,
  token: string,
  filters?: { status?: string; search?: string },
  page = 1,
) {
  const { get } = useAdminApi(apiBase, token);
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      if (filters?.status) params.set('status', filters.status);
      if (filters?.search) params.set('search', filters.search);
      const result = await get<{ data: any[]; total: number }>(`/admin/products?${params}`);
      setData(result.data);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [get, page, filters?.status, filters?.search]);

  useEffect(() => { fetch_(); }, [fetch_]);

  return { data, total, loading, error, refetch: fetch_ };
}

export function useProductActions(apiBase: string, token: string) {
  const { post, patch, del } = useAdminApi(apiBase, token);

  const create = useCallback((data: any) => post('/admin/products', data), [post]);
  const update = useCallback((id: string, data: any) => patch(`/admin/products/${id}`, data), [patch]);
  const remove = useCallback((id: string) => del(`/admin/products/${id}`), [del]);

  return { create, update, remove };
}
