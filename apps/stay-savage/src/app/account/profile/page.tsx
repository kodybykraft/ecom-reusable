'use client';

import { useState, type FormEvent } from 'react';
import { useAuth } from '@ecom/react';
import { Heading } from '@/components/ui/Heading';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Field } from '@/components/ui/Input';

export default function ProfilePage() {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/ecom/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName }),
      });
      if (!res.ok) throw new Error('Save failed');
      setMessage('Saved.');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <Eyebrow>Account details</Eyebrow>
        <Heading variant="m" as="h2" className="mt-1">
          Your profile
        </Heading>
      </div>

      <Card variant="lift" pad="lg">
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="First name" htmlFor="prof-fn">
              <Input
                id="prof-fn"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Field>
            <Field label="Last name" htmlFor="prof-ln">
              <Input
                id="prof-ln"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Field>
          </div>
          <Field label="Email" htmlFor="prof-email" hint="Contact support to change your email">
            <Input id="prof-email" type="email" value={user?.email ?? ''} disabled />
          </Field>
          {message ? (
            <p className="text-[13px] text-bone/60">{message}</p>
          ) : null}
          <div className="pt-2">
            <Button type="submit" variant="pill" size="md" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </form>
      </Card>

      <Card variant="base" pad="lg">
        <Eyebrow className="mb-2 block">Security</Eyebrow>
        <p className="text-bone/60 text-[14px] mb-4">
          Keep your account secure with a strong password.
        </p>
        <Button variant="ghost" size="md" asChild>
          <a href="/auth/forgot-password">Change password</a>
        </Button>
      </Card>
    </div>
  );
}
