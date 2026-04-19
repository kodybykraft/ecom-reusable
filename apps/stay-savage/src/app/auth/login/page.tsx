'use client';

import { Suspense, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Footer } from '@/components/Footer';
import { Section } from '@/components/ui/Section';
import { Heading } from '@/components/ui/Heading';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { Input, Field } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageInner() {
  const router = useRouter();
  const search = useSearchParams();
  const redirect = search.get('redirect') ?? '/account';
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
      router.push(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <main className="flex-1">
        <Section size="auto" pad="lg" contain>
          <div className="max-w-md mx-auto">
            <Card variant="lift" pad="lg" className="flex flex-col gap-6">
              <div className="flex flex-col gap-2 text-center">
                <Eyebrow className="mx-auto">Welcome Back</Eyebrow>
                <Heading variant="m" as="h1" align="center">
                  Sign in
                </Heading>
                <p className="text-[13px] text-bone/60">
                  Track orders, manage addresses, pick up where you left off.
                </p>
              </div>

              {error ? (
                <div
                  role="alert"
                  className="rounded-[var(--radius)] border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 text-savage px-4 py-3 text-[13px]"
                >
                  {error}
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Field label="Email" htmlFor="login-email">
                  <Input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </Field>
                <Field label="Password" htmlFor="login-password">
                  <Input
                    id="login-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    autoComplete="current-password"
                  />
                </Field>
                <div className="flex items-center justify-end">
                  <Link
                    href="/auth/forgot-password"
                    className="text-[12px] uppercase tracking-[var(--tracking-eyebrow)] text-bone/60 hover:text-bone"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Button type="submit" variant="pill" size="lg" fullWidth disabled={loading}>
                  {loading ? 'Signing in…' : 'Sign in'}
                </Button>
              </form>

              <p className="text-center text-[13px] text-bone/60">
                New here?{' '}
                <Link
                  href={`/auth/register${redirect !== '/account' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
                  className="text-bone underline underline-offset-2 hover:no-underline"
                >
                  Create an account
                </Link>
              </p>
            </Card>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
