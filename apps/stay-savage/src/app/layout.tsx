import type { Metadata } from 'next';
import { Poppins, Bebas_Neue } from 'next/font/google';
import { Toaster } from 'sonner';
import { Providers } from '@/components/Providers';
import { CookieConsent } from '@/components/CookieConsent';
import { BackToTop } from '@/components/BackToTop';
import { MarqueeTicker } from '@/components/MarqueeTicker';
import { Header } from '@/components/Header';
import { CartDrawer } from '@/components/CartDrawer';
import './globals.css';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Stay Savage — Heavyweight Tracksuits for Those Who Don't Quit",
    template: '%s | Stay Savage',
  },
  description:
    'Premium 280 GSM heavyweight tracksuits built for serious lifters. UK-designed streetwear for those who earn it. Free UK shipping.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://stay-savage.com'),
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Stay Savage',
    images: [{ url: '/images/products/stay-savage---black-01.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@staysavageltd',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${poppins.variable} ${bebasNeue.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased bg-background text-foreground">
        <Providers>
          <MarqueeTicker />
          <Header />
          <CartDrawer />
          {children}
          <Toaster position="top-right" theme="dark" />
          <CookieConsent />
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}
