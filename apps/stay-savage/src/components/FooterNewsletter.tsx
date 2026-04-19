'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export function FooterNewsletter() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Enter a valid email');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/ecom/email/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'newsletter' }),
      });

      if (res.ok) {
        toast.success('Welcome to The Pack.');
        setEmail('');
      } else {
        toast.error('Something went wrong');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="your@email.com"
        className="flex-1 bg-transparent border border-border px-4 py-4 text-bone placeholder:text-bone/40 focus:outline-none focus:border-bone transition-colors"
      />
      <button
        type="submit"
        disabled={submitting}
        className="bg-bone text-ink font-display tracking-[0.2em] text-sm px-7 py-4 hover:bg-savage hover:text-bone transition-colors disabled:opacity-50"
      >
        {submitting ? '...' : 'SIGN UP'}
      </button>
    </form>
  );
}
