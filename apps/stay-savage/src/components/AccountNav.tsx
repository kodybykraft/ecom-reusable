'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Package, MapPin, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Eyebrow } from '@/components/ui/Eyebrow';

const NAV = [
  { href: '/account', label: 'Overview', icon: User, exact: true },
  { href: '/account/orders', label: 'Orders', icon: Package },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin },
  { href: '/account/profile', label: 'Profile', icon: Settings },
];

export function AccountNav({ onSignOut }: { onSignOut?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Account">
      <Eyebrow className="mb-4 block">Your Account</Eyebrow>
      <ul className="space-y-0 border border-border rounded-[var(--radius)] overflow-hidden">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  'flex items-center gap-3 px-5 py-4 border-b border-border last:border-b-0 text-[14px] transition-colors',
                  active
                    ? 'bg-card text-bone'
                    : 'text-bone/60 hover:bg-card hover:text-bone'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
                {active ? (
                  <span className="ml-auto inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-savage-silver)]" />
                ) : null}
              </Link>
            </li>
          );
        })}
        {onSignOut ? (
          <li>
            <button
              onClick={onSignOut}
              className="w-full flex items-center gap-3 px-5 py-4 text-[14px] text-bone/60 hover:bg-card hover:text-savage transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </button>
          </li>
        ) : null}
      </ul>
    </nav>
  );
}
