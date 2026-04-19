'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export function NewsletterForm({ className = '' }: { className?: string }) {
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
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email. No noise, just drops."
        className="flex-1 px-4 py-2.5 glass-subtle  text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
      />
      <button
        type="submit"
        disabled={submitting}
        className="px-6 py-2.5 bg-accent text-accent-foreground text-sm font-bold hover:bg-accent/90 transition-colors disabled:opacity-50"
      >
        {submitting ? '...' : 'Join'}
      </button>
    </form>
  );
}
