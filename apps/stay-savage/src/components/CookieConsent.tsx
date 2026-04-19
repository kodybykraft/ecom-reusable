'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const CONSENT_KEY = 'ss_cookie_consent';

type ConsentState = 'undecided' | 'accepted' | 'declined';

export function CookieConsent() {
  const [consent, setConsent] = useState<ConsentState>('undecided');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(CONSENT_KEY) as ConsentState | null;
    if (stored) setConsent(stored);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setConsent('accepted');
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setConsent('declined');
  };

  // Don't render on server or if already decided
  if (!mounted || consent !== 'undecided') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-card border-t border-border animate-slide-up">
      <div className="container mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-bone/60 text-center sm:text-left">
          We use cookies for essential site functionality and analytics (with your consent).{' '}
          <Link href="/privacy" className="underline text-savage hover:text-bone transition-colors">
            Privacy Policy
          </Link>
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={handleDecline}
            className="px-5 py-2.5 text-sm border border-border text-bone/60 hover:text-bone hover:border-bone transition-colors"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="px-5 py-2.5 text-sm bg-bone text-ink font-display tracking-[0.15em] hover:bg-savage hover:text-bone transition-colors"
          >
            ACCEPT ALL
          </button>
        </div>
      </div>
    </div>
  );
}

// Export helper to check consent status from other components
export function getCookieConsent(): ConsentState {
  if (typeof window === 'undefined') return 'undecided';
  return (localStorage.getItem(CONSENT_KEY) as ConsentState) || 'undecided';
}
