'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAdminApi } from './use-admin-api';

export function useAdminImportExport(apiBase: string, token: string) {
  const { get, post } = useAdminApi(apiBase, token);
  const [imports, setImports] = useState<any[]>([]);
  const [exports, setExports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [importsRes, exportsRes] = await Promise.all([
        get<{ data: any[] }>('/admin/imports'),
        get<{ data: any[] }>('/admin/exports'),
      ]);
      setImports(importsRes.data);
      setExports(exportsRes.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [get]);

  useEffect(() => { fetch_(); }, [fetch_]);

  const createImport = useCallback((data: any) => post('/admin/imports', data), [post]);
  const createExport = useCallback((data: any) => post('/admin/exports', data), [post]);

  return { imports, exports, loading, error, createImport, createExport, refetch: fetch_ };
}
