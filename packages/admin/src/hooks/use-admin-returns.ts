'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAdminApi } from './use-admin-api';

export function useAdminReturns(
  apiBase: string,
  token: string,
  filters?: { status?: string },
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
      const result = await get<{ data: any[]; total: number }>(`/admin/returns?${params}`);
      setData(result.data);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [get, page, filters?.status]);

  useEffect(() => { fetch_(); }, [fetch_]);

  return { data, total, loading, error, refetch: fetch_ };
}

export function useReturnActions(apiBase: string, token: string) {
  const { post } = useAdminApi(apiBase, token);

  const approve = useCallback((id: string) => post(`/admin/returns/${id}/approve`, {}), [post]);
  const receive = useCallback((id: string) => post(`/admin/returns/${id}/receive`, {}), [post]);
  const refund = useCallback((id: string) => post(`/admin/returns/${id}/refund`, {}), [post]);
  const create = useCallback((data: any) => post('/admin/returns', data), [post]);

  return { approve, receive, refund, create };
}
