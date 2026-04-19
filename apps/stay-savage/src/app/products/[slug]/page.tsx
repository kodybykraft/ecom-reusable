import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Footer } from '@/components/Footer';
import { TrustBadges } from '@/components/TrustBadges';
import { CrossSell } from '@/components/CrossSell';
import { Section } from '@/components/ui/Section';
import { Heading } from '@/components/ui/Heading';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Card } from '@/components/ui/Card';
import { ProductClient } from './ProductClient';
import { ecom } from '@/lib/ecom';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await ecom.products.getBySlug(slug).catch(() => null);
  if (!product) return {};

  const meta = product.metadata as Record<string, unknown> | null;
  const price = product.variants?.[0]?.price ?? 0;
  const weight = (meta?.weight as string | undefined) ?? '';
  const fabric = (meta?.fabric as string | undefined) ?? '';
  return {
    title: product.title,
    description: `${product.title}. ${weight} ${fabric}. £${(price / 100).toFixed(0)}. Free UK shipping.`,
    openGraph: {
      images: product.images?.[0] ? [{ url: product.images[0].url }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await ecom.products.getBySlug(slug).catch(() => null);
  if (!product) notFound();

  const meta = product.metadata as Record<string, unknown> | null;

  type RelatedProduct = { id: string; [k: string]: unknown };
  let relatedProducts: RelatedProduct[] = [];
  try {
    const result = await ecom.products.list({ status: 'active' }, { pageSize: 10 });
    relatedProducts = (result.data as RelatedProduct[]).filter((p) => p.id !== product.id);
  } catch {
    // non-fatal — render without cross-sell
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images?.map((img) => img.url) ?? [],
    brand: { '@type': 'Brand', name: 'Stay Savage' },
    offers: {
      '@type': 'Offer',
      price: ((product.variants[0]?.price ?? 0) / 100).toFixed(2),
      priceCurrency: 'GBP',
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Stay Savage LTD' },
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Shop', item: 'https://stay-savage.com/shop' },
      { '@type': 'ListItem', position: 2, name: product.title },
    ],
  };

  const collection = meta?.collection as string | undefined;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <main className="flex-1">
        {/* Top strip — breadcrumb + collection label */}
        <Section size="auto" pad="sm" contain>
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[12px] uppercase tracking-[var(--tracking-eyebrow)] text-bone/60">
            <Link href="/shop" className="hover:text-bone transition-colors">
              Shop
            </Link>
            <span className="text-bone/40">/</span>
            {collection ? (
              <>
                <Link href={`/shop?category=${collection}`} className="hover:text-bone transition-colors capitalize">
                  {collection} Series
                </Link>
                <span className="text-bone/40">/</span>
              </>
            ) : null}
            <span className="text-bone">{product.title}</span>
          </nav>
        </Section>

        {/* Main product block — gallery left, details right (client component) */}
        <Section size="auto" pad="md" contain>
          <ProductClient product={product} meta={meta} />
        </Section>

        {/* Trust band */}
        <Section size="auto" pad="sm" bg="surface" contain>
          <TrustBadges />
        </Section>

        {/* Reviews */}
        <Section size="auto" pad="md" contain>
          <div className="max-w-3xl flex flex-col gap-4">
            <Eyebrow>Reviews</Eyebrow>
            <Heading variant="m" as="h2">
              What they say
            </Heading>
            <Card variant="lift" pad="lg" className="text-center">
              <p className="text-bone/60">No reviews yet.</p>
              <p className="text-[13px] text-bone/40 mt-2">
                Be the first to review {product.title}.
              </p>
            </Card>
          </div>
        </Section>

        {/* Cross-sell */}
        {relatedProducts.length > 0 ? (
          <Section size="auto" pad="md" contain>
            <CrossSell products={relatedProducts as never} title="Complete The Look" />
          </Section>
        ) : null}
      </main>

      <Footer />
    </>
  );
}
