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

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterPageInner />
    </Suspense>
  );
}

function RegisterPageInner() {
  const router = useRouter();
  const search = useSearchParams();
  const redirect = search.get('redirect') ?? '/account';
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/ecom/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error?.message || data.message || 'Registration failed');
      }

      await res.json();
      router.push(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
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
                <Eyebrow className="mx-auto">Join The Pack</Eyebrow>
                <Heading variant="m" as="h1" align="center">
                  Create account
                </Heading>
                <p className="text-[13px] text-bone/60">
                  Faster checkout, order history, and first access to drops.
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
                <div className="grid grid-cols-2 gap-3">
                  <Field label="First name" htmlFor="register-fn">
                    <Input
                      id="register-fn"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      autoComplete="given-name"
                    />
                  </Field>
                  <Field label="Last name" htmlFor="register-ln">
                    <Input
                      id="register-ln"
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      autoComplete="family-name"
                    />
                  </Field>
                </div>
                <Field label="Email" htmlFor="register-email">
                  <Input
                    id="register-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </Field>
                <Field
                  label="Password"
                  htmlFor="register-password"
                  hint="At least 8 characters"
                >
                  <Input
                    id="register-password"
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </Field>
                <Button type="submit" variant="pill" size="lg" fullWidth disabled={loading}>
                  {loading ? 'Creating account…' : 'Create account'}
                </Button>
              </form>

              <p className="text-center text-[13px] text-bone/60">
                Already registered?{' '}
                <Link
                  href={`/auth/login${redirect !== '/account' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
                  className="text-bone underline underline-offset-2 hover:no-underline"
                >
                  Sign in
                </Link>
              </p>
              <p className="text-center text-[11px] uppercase tracking-[var(--tracking-eyebrow)] text-bone/40">
                By creating an account you agree to our{' '}
                <Link href="/terms" className="underline">
                  Terms
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="underline">
                  Privacy
                </Link>
                .
              </p>
            </Card>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
