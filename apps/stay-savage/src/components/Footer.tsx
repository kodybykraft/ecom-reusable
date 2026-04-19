import Link from 'next/link';
import { Instagram } from 'lucide-react';
import { FooterNewsletter } from '@/components/FooterNewsletter';

const cols = [
  {
    title: 'SHOP',
    links: [
      { label: 'All Products', href: '/shop' },
      { label: 'OG Series', href: '/shop?category=og' },
      { label: 'Reflective', href: '/shop?category=reflective' },
      { label: 'Size Guide', href: '/faq' },
    ],
  },
  {
    title: 'HELP',
    links: [
      { label: 'Shipping', href: '/shipping' },
      { label: 'Returns', href: '/returns' },
      { label: 'Contact', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Track Order', href: '/order-tracking' },
    ],
  },
  {
    title: 'STAY SAVAGE',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Your Account', href: '/account' },
      { label: 'Sign In', href: '/auth/login' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-ink border-t border-border">
      {/* Newsletter band */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-display text-4xl md:text-5xl tracking-tight text-bone">
              JOIN THE PACK.
            </h2>
            <p className="mt-3 text-bone/60 text-sm max-w-md">
              First access to drops, restocks, and the occasional uncomfortable truth.
            </p>
          </div>
          <FooterNewsletter />
        </div>
      </div>

      {/* Link columns */}
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <p className="font-display text-2xl tracking-[0.15em] text-bone">STAY SAVAGE</p>
          <p className="mt-3 text-xs text-bone/50 leading-relaxed max-w-[14rem]">
            UK heavyweight streetwear. 280 GSM brushed fleece. Built for those who earn it.
          </p>
          <div className="mt-5 flex items-center gap-4 text-bone/60">
            <a
              aria-label="Instagram"
              href="https://instagram.com/staysavageltd"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-bone transition-colors"
            >
              <Instagram className="size-4" />
            </a>
            <a
              href="https://www.tiktok.com/@staysavage.ltd"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-bone transition-colors text-xs font-display tracking-widest"
            >
              TIKTOK
            </a>
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="font-display text-xs tracking-[0.3em] text-bone/60 mb-4">{c.title}</p>
            <ul className="space-y-3">
              {c.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-bone/80 hover:text-bone transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] tracking-wider text-bone/40">
          <p>&copy; {new Date().getFullYear()} STAY SAVAGE LTD &middot; #14703196. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-bone transition-colors">PRIVACY</Link>
            <Link href="/terms" className="hover:text-bone transition-colors">TERMS</Link>
            <Link href="/shipping" className="hover:text-bone transition-colors">SHIPPING</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
