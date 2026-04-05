import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';

interface AuthState {
  user: { id: string; email: string; firstName: string | null; lastName: string | null } | null;
  token: string | null;
}

interface EcomContextValue {
  apiBase: string;
  auth: AuthState;
  setAuth: (auth: AuthState) => void;
  clearAuth: () => void;
  fetcher: <T>(path: string, options?: RequestInit) => Promise<T>;
}

const EcomContext = createContext<EcomContextValue | null>(null);

export function EcomProvider({
  apiBase = '/api/ecom',
  children,
}: {
  apiBase?: string;
  children: ReactNode;
}) {
  const [auth, setAuth] = useState<AuthState>({ user: null, token: null });

  const clearAuth = useCallback(() => {
    setAuth({ user: null, token: null });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ecom_token');
    }
  }, []);

  // Restore token from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('ecom_token');
      if (savedToken) {
        setAuth((prev) => ({ ...prev, token: savedToken }));
      }
    }
  }, []);

  // Persist token changes
  useEffect(() => {
    if (typeof window !== 'undefined' && auth.token) {
      localStorage.setItem('ecom_token', auth.token);
    }
  }, [auth.token]);

  const fetcher = useCallback(
    async <T,>(path: string, options: RequestInit = {}): Promise<T> => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      };
      if (auth.token) {
        headers['Authorization'] = `Bearer ${auth.token}`;
      }

      const res = await fetch(`${apiBase}${path}`, { ...options, headers });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(error.message ?? `Request failed: ${res.status}`);
      }
      return res.json();
    },
    [apiBase, auth.token],
  );

  return (
    <EcomContext.Provider value={{ apiBase, auth, setAuth, clearAuth, fetcher }}>
      {children}
    </EcomContext.Provider>
  );
}

export function useEcom() {
  const ctx = useContext(EcomContext);
  if (!ctx) throw new Error('useEcom must be used within an EcomProvider');
  return ctx;
}
