import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'E-Com Demo Store',
  description: 'Demo storefront powered by @ecom packages',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0, padding: 0 }}>
        <header style={{ borderBottom: '1px solid #eee', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={{ fontWeight: 'bold', fontSize: '1.25rem', textDecoration: 'none', color: '#000' }}>
            E-Com Demo
          </a>
          <nav style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="/products">Products</a>
            <a href="/cart">Cart</a>
            <a href="/account">Account</a>
          </nav>
        </header>
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
