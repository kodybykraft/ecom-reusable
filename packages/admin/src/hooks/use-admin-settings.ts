'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAdminApi } from './use-admin-api';

export function useAdminSettings(apiBase: string, token: string, section: string) {
  const { get, patch } = useAdminApi(apiBase, token);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await get<{ data: any }>(`/admin/settings/${section}`);
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [get, section]);

  useEffect(() => { fetch_(); }, [fetch_]);

  const save = useCallback(
    async (values: any) => {
      setLoading(true);
      setError(null);
      try {
        const result = await patch<{ data: any }>(`/admin/settings/${section}`, values);
        setData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    },
    [patch, section],
  );

  return { data, loading, error, save, refetch: fetch_ };
}
