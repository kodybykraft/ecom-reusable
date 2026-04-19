'use client';

import Link from 'next/link';
import { ShoppingBag, Search, Menu, X, Instagram } from 'lucide-react';
import { useCart } from '@ecom/react';
import { useUI } from '@/components/Providers';

const links = [
  { label: 'Shop', href: '/shop' },
  { label: 'Reflective', href: '/shop?category=reflective' },
  { label: 'About', href: '/about' },
  { label: 'Journal', href: '/journal' },
  { label: 'Contact', href: '/contact' },
];

export function Header() {
  const { setCartOpen, setMenuOpen, menuOpen } = useUI();
  const { cart } = useCart();
  const count = cart?.itemCount ?? 0;

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-[1600px] px-4 md:px-8 h-16 flex items-center justify-between relative">
          <button
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="md:hidden p-2 -ml-2 text-bone hover:text-savage transition-colors"
          >
            <Menu className="size-5" />
          </button>

          <nav className="hidden md:flex items-center gap-7">
            {links.slice(0, 3).map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="font-display text-sm tracking-[0.2em] text-bone/80 hover:text-bone transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 font-display text-2xl tracking-[0.15em] text-bone"
          >
            STAY SAVAGE
          </Link>

          <div className="flex items-center gap-5">
            <nav className="hidden md:flex items-center gap-7">
              {links.slice(3).map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="font-display text-sm tracking-[0.2em] text-bone/80 hover:text-bone transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <Link href="/search" aria-label="Search" className="text-bone/80 hover:text-bone transition-colors">
              <Search className="size-5" />
            </Link>
            <button
              aria-label="Cart"
              onClick={() => setCartOpen(true)}
              className="relative text-bone/80 hover:text-bone transition-colors"
            >
              <ShoppingBag className="size-5" />
              {count > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-savage text-bone text-[10px] font-display tracking-wider rounded-full size-4 flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-[60] bg-ink/70 backdrop-blur-sm transition-opacity md:hidden ${
          menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />
      <aside
        className={`fixed top-0 left-0 z-[70] h-full w-[85%] max-w-sm bg-ink border-r border-border flex flex-col transition-transform duration-300 md:hidden ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <p className="font-display text-lg tracking-[0.2em] text-bone">MENU</p>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="text-bone/70 hover:text-bone transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          {[...links, { label: 'Account', href: '/account' }, { label: 'Track Order', href: '/order-tracking' }].map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block px-5 py-4 font-display text-2xl tracking-[0.1em] text-bone border-b border-border/50 hover:bg-card transition-colors"
            >
              {l.label.toUpperCase()}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border p-5 space-y-4">
          <div className="flex items-center gap-5 text-bone/60">
            <a aria-label="Instagram" href="https://instagram.com/staysavageltd" target="_blank" rel="noopener noreferrer" className="hover:text-bone transition-colors">
              <Instagram className="size-5" />
            </a>
          </div>
          <p className="text-[11px] tracking-wider text-bone/40">&copy; STAY SAVAGE LTD.</p>
        </div>
      </aside>
    </>
  );
}
