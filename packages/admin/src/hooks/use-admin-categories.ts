'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAdminApi } from './use-admin-api';

export function useAdminCategories(apiBase: string, token: string) {
  const { get } = useAdminApi(apiBase, token);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await get<{ data: any[] }>('/admin/categories');
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [get]);

  useEffect(() => { fetch_(); }, [fetch_]);

  return { data, loading, error, refetch: fetch_ };
}

export function useCategoryActions(apiBase: string, token: string) {
  const { post, patch, del } = useAdminApi(apiBase, token);

  const create = useCallback((data: any) => post('/admin/categories', data), [post]);
  const update = useCallback((id: string, data: any) => patch(`/admin/categories/${id}`, data), [patch]);
  const remove = useCallback((id: string) => del(`/admin/categories/${id}`), [del]);

  return { create, update, remove };
}
