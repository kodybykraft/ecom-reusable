'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAdminApi } from './use-admin-api';

export function useAdminInventory(apiBase: string, token: string, locationId?: string) {
  const { get } = useAdminApi(apiBase, token);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (locationId) params.set('locationId', locationId);
      const result = await get<{ data: any[] }>(`/admin/inventory?${params}`);
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [get, locationId]);

  useEffect(() => { fetch_(); }, [fetch_]);

  return { data, loading, error, refetch: fetch_ };
}

export function useInventoryActions(apiBase: string, token: string) {
  const { post } = useAdminApi(apiBase, token);

  const adjust = useCallback((data: any) => post('/admin/inventory/adjust', data), [post]);

  return { adjust };
}
