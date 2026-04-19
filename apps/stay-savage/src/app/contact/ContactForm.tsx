'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Fill in all required fields');
      return;
    }
    setSubmitting(true);
    // TODO: Wire to API when email service is configured
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
    setSubmitting(false);
  };

  if (sent) {
    return (
      <div className="text-center py-12">
        <p className="text-xl font-bold mb-2">Message sent.</p>
        <p className="text-muted-foreground">We will get back to you within 24 hours.</p>
      </div>
    );
  }

  const inputClass = 'w-full p-3 bg-card border border-border text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none transition-colors';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="text-sm font-bold block mb-1.5">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className="text-sm font-bold block mb-1.5">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            className={inputClass}
            required
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-bold block mb-1.5">Subject</label>
        <select
          value={form.subject}
          onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
          className={inputClass}
        >
          <option value="">Select...</option>
          <option value="order">Order Enquiry</option>
          <option value="returns">Returns / Exchange</option>
          <option value="sizing">Sizing Question</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-bold block mb-1.5">Message</label>
        <textarea
          value={form.message}
          onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
          rows={5}
          className={`${inputClass} resize-none`}
          required
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-4 bg-foreground text-background font-bold text-sm tracking-[0.15em] uppercase hover:opacity-90 press-active transition-all disabled:opacity-50"
      >
        {submitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
