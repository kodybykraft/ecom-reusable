'use client';

import { useState, useCallback } from 'react';

export function useAdminApi(apiBase: string, token?: string) {
  const [loading, setLoading] = useState(false);

  const request = useCallback(
    async <T>(path: string, options: RequestInit = {}): Promise<T> => {
      setLoading(true);
      try {
        const res = await fetch(`${apiBase}${path}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
          },
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ message: res.statusText }));
          throw new Error(err.message ?? `Request failed: ${res.status}`);
        }
        return res.json();
      } finally {
        setLoading(false);
      }
    },
    [apiBase, token],
  );

  const get = useCallback(<T>(path: string) => request<T>(path), [request]);
  const post = useCallback(
    <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
    [request],
  );
  const patch = useCallback(
    <T>(path: string, body: unknown) => request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
    [request],
  );
  const del = useCallback(
    <T>(path: string) => request<T>(path, { method: 'DELETE' }),
    [request],
  );

  return { get, post, patch, del, loading };
}
