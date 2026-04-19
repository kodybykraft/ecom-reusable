import { Hero } from '@/components/Hero';
import { ProductGrid } from '@/components/ProductGrid';
import { Features } from '@/components/Features';
import { FeaturedBundle } from '@/components/FeaturedBundle';
import { Lookbook } from '@/components/Lookbook';
import { Footer } from '@/components/Footer';
import { ecom } from '@/lib/ecom';

export default async function Home() {
  let products: { id: string; slug: string; title: string; images?: { url: string }[]; variants?: { price: number }[] }[] = [];
  try {
    const result = await ecom.products.list({ status: 'active' }, { pageSize: 8 });
    products = result.data as typeof products;
  } catch {
    // DB unavailable — fall back to static product grid
  }

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Stay Savage',
    legalName: 'Stay Savage LTD',
    url: 'https://stay-savage.com',
    logo: 'https://stay-savage.com/brand/logo.jpg',
    sameAs: [
      'https://instagram.com/staysavageltd',
      'https://www.tiktok.com/@staysavage.ltd',
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '118 Plashet Road',
      addressLocality: 'London',
      postalCode: 'E13 0QS',
      addressCountry: 'GB',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <main>
        <Hero />
        <ProductGrid dbProducts={products} />
        <Features />
        <FeaturedBundle />
        <Lookbook />
      </main>
      <Footer />
    </>
  );
}
