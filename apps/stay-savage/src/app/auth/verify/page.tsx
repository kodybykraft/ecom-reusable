'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Check, X } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { Section } from '@/components/ui/Section';
import { Heading } from '@/components/ui/Heading';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

type Status = 'verifying' | 'ok' | 'fail';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailInner />
    </Suspense>
  );
}

function VerifyEmailInner() {
  const search = useSearchParams();
  const token = search.get('token');
  const [status, setStatus] = useState<Status>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('fail');
      setMessage('No verification token found in the link.');
      return;
    }
    let cancel = false;
    (async () => {
      try {
        const res = await fetch('/api/ecom/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error?.message || 'Verification failed');
        }
        if (!cancel) {
          setStatus('ok');
          setMessage('Email confirmed.');
        }
      } catch (err) {
        if (!cancel) {
          setStatus('fail');
          setMessage(err instanceof Error ? err.message : 'Verification failed');
        }
      }
    })();
    return () => {
      cancel = true;
    };
  }, [token]);

  return (
    <>
      <main className="flex-1">
        <Section size="auto" pad="lg" contain>
          <div className="max-w-md mx-auto">
            <Card variant="lift" pad="lg" className="flex flex-col items-center gap-5 text-center">
              <span
                className={`inline-flex h-14 w-14 items-center justify-center rounded-full border ${
                  status === 'ok'
                    ? 'border-[var(--color-success)] bg-[var(--color-success)]/10 text-green-500'
                    : status === 'fail'
                      ? 'border-[var(--color-danger)] bg-[var(--color-danger)]/10 text-savage'
                      : 'border-border text-bone/60'
                }`}
              >
                {status === 'ok' ? <Check className="h-6 w-6" /> : status === 'fail' ? <X className="h-6 w-6" /> : <span className="font-display text-[20px]">…</span>}
              </span>
              <div className="flex flex-col gap-2">
                <Eyebrow>{status === 'ok' ? 'Verified' : status === 'fail' ? 'Problem' : 'Verifying'}</Eyebrow>
                <Heading variant="m" as="h1" align="center">
                  {status === 'ok'
                    ? 'You\u2019re all set'
                    : status === 'fail'
                      ? 'Verification failed'
                      : 'Confirming email\u2026'}
                </Heading>
                {message ? (
                  <p className="text-[14px] text-bone/60">{message}</p>
                ) : null}
              </div>
              {status !== 'verifying' ? (
                <Button variant="pill" size="md" asChild>
                  <Link href={status === 'ok' ? '/account' : '/auth/login'}>
                    {status === 'ok' ? 'Go to your account' : 'Back to sign in'}
                  </Link>
                </Button>
              ) : null}
            </Card>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
