'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAdminApi } from './use-admin-api';

export function useAdminDiscounts(apiBase: string, token: string, page = 1) {
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
      const result = await get<{ data: any[]; total: number }>(`/admin/discounts?${params}`);
      setData(result.data);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [get, page]);

  useEffect(() => { fetch_(); }, [fetch_]);

  return { data, total, loading, error, refetch: fetch_ };
}

export function useDiscountActions(apiBase: string, token: string) {
  const { post, patch, del } = useAdminApi(apiBase, token);

  const create = useCallback((data: any) => post('/admin/discounts', data), [post]);
  const update = useCallback((id: string, data: any) => patch(`/admin/discounts/${id}`, data), [patch]);
  const remove = useCallback((id: string) => del(`/admin/discounts/${id}`), [del]);

  return { create, update, remove };
}
