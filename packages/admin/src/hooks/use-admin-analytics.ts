'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAdminApi } from './use-admin-api';

export function useAdminAnalytics(
  apiBase: string,
  token: string,
  dateRange: { from: string; to: string },
) {
  const { get } = useAdminApi(apiBase, token);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('from', dateRange.from);
      params.set('to', dateRange.to);
      const result = await get<{ data: any }>(`/admin/analytics?${params}`);
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [get, dateRange.from, dateRange.to]);

  useEffect(() => { fetch_(); }, [fetch_]);

  return { data, loading, error, refetch: fetch_ };
}
