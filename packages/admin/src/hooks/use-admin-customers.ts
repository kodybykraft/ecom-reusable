'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAdminApi } from './use-admin-api';

export function useAdminCustomers(
  apiBase: string,
  token: string,
  search?: string,
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
      if (search) params.set('search', search);
      const result = await get<{ data: any[]; total: number }>(`/admin/customers?${params}`);
      setData(result.data);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [get, page, search]);

  useEffect(() => { fetch_(); }, [fetch_]);

  return { data, total, loading, error, refetch: fetch_ };
}
