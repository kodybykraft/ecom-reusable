'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/ecom/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error?.message ?? 'Invalid credentials');
        return;
      }

      router.push(redirect);
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f1117',
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: 380,
          padding: 32,
          background: '#1a1d27',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <h1
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: '#fff',
            marginBottom: 4,
            textAlign: 'center',
          }}
        >
          Admin Login
        </h1>
        <p
          style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.5)',
            marginBottom: 24,
            textAlign: 'center',
          }}
        >
          Stay Savage Dashboard
        </p>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              marginBottom: 16,
              borderRadius: 8,
              background: 'rgba(200,50,30,0.15)',
              border: '1px solid rgba(200,50,30,0.3)',
              color: '#f87171',
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        <label
          style={{
            display: 'block',
            fontSize: 12,
            fontWeight: 500,
            color: 'rgba(255,255,255,0.6)',
            marginBottom: 6,
          }}
        >
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
          placeholder="you@example.com"
          aria-label="Email"
          style={{
            width: '100%',
            padding: '10px 14px',
            marginBottom: 16,
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.05)',
            color: '#fff',
            fontSize: 14,
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />

        <label
          style={{
            display: 'block',
            fontSize: 12,
            fontWeight: 500,
            color: 'rgba(255,255,255,0.6)',
            marginBottom: 6,
          }}
        >
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          aria-label="Password"
          style={{
            width: '100%',
            padding: '10px 14px',
            marginBottom: 24,
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.05)',
            color: '#fff',
            fontSize: 14,
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px 0',
            borderRadius: 8,
            border: 'none',
            background: loading ? '#4a4d57' : '#6366f1',
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
