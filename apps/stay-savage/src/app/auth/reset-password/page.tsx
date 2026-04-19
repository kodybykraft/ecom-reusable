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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordPageInner />
    </Suspense>
  );
}

function ResetPasswordPageInner() {
  const router = useRouter();
  const search = useSearchParams();
  const token = search.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (!token) {
      setError('This reset link is invalid or expired.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/ecom/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error?.message || 'Reset failed');
      }
      router.replace('/auth/login?reset=1');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset failed');
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
                <Eyebrow className="mx-auto">Password</Eyebrow>
                <Heading variant="m" as="h1" align="center">
                  Choose a new password
                </Heading>
                <p className="text-[13px] text-bone/60">
                  Minimum 8 characters. Make it solid.
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
                <Field label="New password" htmlFor="rp-pw">
                  <Input
                    id="rp-pw"
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </Field>
                <Field label="Confirm password" htmlFor="rp-confirm">
                  <Input
                    id="rp-confirm"
                    type="password"
                    required
                    minLength={8}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    autoComplete="new-password"
                  />
                </Field>
                <Button type="submit" variant="pill" size="lg" fullWidth disabled={loading}>
                  {loading ? 'Resetting…' : 'Reset password'}
                </Button>
              </form>

              <p className="text-center text-[13px] text-bone/60">
                <Link
                  href="/auth/login"
                  className="text-bone underline underline-offset-2 hover:no-underline"
                >
                  Back to sign in
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
