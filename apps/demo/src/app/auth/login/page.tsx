'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
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
        throw new Error(data.error?.message || data.message || 'Invalid email or password');
      }

      await res.json();
      // Token is set as HttpOnly cookie by the server response — no localStorage needed
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: 8,
    color: '#f1f5f9',
    fontSize: '0.9375rem',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f172a',
        padding: '1rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          background: '#1B2559',
          borderRadius: 16,
          padding: '2.5rem 2rem',
          boxShadow: '0 8px 32px rgba(0,0,0,.4)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1
            style={{
              color: '#f1f5f9',
              fontSize: '1.5rem',
              fontWeight: 700,
              margin: '0 0 0.25rem',
            }}
          >
            Admin Login
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>
            Sign in to your store dashboard
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 8,
              color: '#fca5a5',
              fontSize: '0.875rem',
              marginBottom: '1.25rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '0.375rem',
                color: '#cbd5e1',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@store.com"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '0.375rem',
                color: '#cbd5e1',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: loading ? '#1e40af' : '#2D60FF',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: '0.9375rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background .2s',
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p
          style={{
            textAlign: 'center',
            marginTop: '1.25rem',
            color: '#94a3b8',
            fontSize: '0.8125rem',
          }}
        >
          Don&apos;t have an account?{' '}
          <a
            href="/auth/register"
            style={{ color: '#2D60FF', textDecoration: 'none' }}
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
