'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/Footer';
import { Section } from '@/components/ui/Section';
import { Heading } from '@/components/ui/Heading';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { Input, Field } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await fetch('/api/ecom/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Try again.');
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
                  Reset your password
                </Heading>
                <p className="text-[13px] text-bone/60">
                  Enter the email you signed up with. We&apos;ll send a reset link.
                </p>
              </div>

              {submitted ? (
                <div className="rounded-[var(--radius)] border border-[var(--color-success)]/30 bg-[var(--color-success)]/10 text-green-500 px-4 py-3 text-[13px] text-center">
                  If an account exists for {email}, a reset link is on the way.
                </div>
              ) : (
                <>
                  {error ? (
                    <div
                      role="alert"
                      className="rounded-[var(--radius)] border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 text-savage px-4 py-3 text-[13px]"
                    >
                      {error}
                    </div>
                  ) : null}
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Field label="Email" htmlFor="fp-email">
                      <Input
                        id="fp-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                      />
                    </Field>
                    <Button type="submit" variant="pill" size="lg" fullWidth disabled={loading}>
                      {loading ? 'Sending…' : 'Send reset link'}
                    </Button>
                  </form>
                </>
              )}

              <p className="text-center text-[13px] text-bone/60">
                Remembered?{' '}
                <Link
                  href="/auth/login"
                  className="text-bone underline underline-offset-2 hover:no-underline"
                >
                  Sign in
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
