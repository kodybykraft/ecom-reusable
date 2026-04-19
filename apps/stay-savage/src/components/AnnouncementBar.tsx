'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative bg-foreground text-background text-center py-2.5 text-[11px] tracking-[0.25em] uppercase font-medium">
      <span>Free UK Shipping on All Orders</span>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:opacity-60 transition-opacity"
        aria-label="Dismiss"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
