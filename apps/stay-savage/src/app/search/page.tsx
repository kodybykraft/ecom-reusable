import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Footer } from '@/components/Footer';
import { Section } from '@/components/ui/Section';
import { Heading } from '@/components/ui/Heading';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ecom } from '@/lib/ecom';

export const metadata: Metadata = {
  title: 'Search',
  robots: { index: false, follow: true },
};

type Product = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  images?: { url: string; altText?: string | null }[];
  variants?: { price: number }[];
  metadata?: Record<string, unknown> | null;
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = '' } = await searchParams;
  const query = q.trim();

  let results: Product[] = [];
  if (query) {
    try {
      const response = await ecom.products.list({ status: 'active' }, { pageSize: 30 });
      const term = query.toLowerCase();
      results = ((response.data ?? []) as unknown as Product[]).filter((p) => {
        const haystack = `${p.title} ${p.description ?? ''}`.toLowerCase();
        return haystack.includes(term);
      });
    } catch {
      // Non-fatal — empty result set
    }
  }

  return (
    <>
      <main className="flex-1">
        <Section size="auto" pad="md" contain>
          <div className="max-w-3xl flex flex-col gap-3 mb-10">
            <Eyebrow>Search</Eyebrow>
            <Heading variant="inner" as="h1">
              {query ? (
                <>
                  Results for <span className="text-bone/60">“{query}”</span>
                </>
              ) : (
                'Search the drop'
              )}
            </Heading>
            <p className="text-bone/60">
              {query
                ? `${results.length} result${results.length === 1 ? '' : 's'} matching your search.`
                : 'Type what you’re looking for in the search bar above.'}
            </p>
          </div>

          {query && results.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {results.map((product) => {
                const image = product.images?.[0];
                const price = product.variants?.[0]?.price ?? 0;
                const collection = (product.metadata as { collection?: string } | null)?.collection;
                return (
                  <Link key={product.id} href={`/products/${product.slug}`} className="group block">
                    <Card variant="product" pad="none" interactive>
                      <div className="aspect-[3/4] relative overflow-hidden">
                        {image ? (
                          <Image
                            src={image.url}
                            alt={image.altText || product.title}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 40vw, 30vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="w-full h-full bg-card" />
                        )}
                        {collection === 'reflective' ? (
                          <Badge variant="silver" size="sm" className="absolute top-3 left-3">
                            Reflective
                          </Badge>
                        ) : null}
                      </div>
                      <div className="flex items-center justify-between p-4 md:p-5">
                        <p className="font-display text-[16px] md:text-[18px] uppercase line-clamp-1">
                          {product.title}
                        </p>
                        <p className="font-display text-[18px] md:text-[20px]">£{Math.round(price / 100)}</p>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : query ? (
            <div className="max-w-lg flex flex-col items-start gap-4">
              <Eyebrow muted>Nothing matched</Eyebrow>
              <p className="text-bone/60">
                Try a shorter term, a colour name like “navy”, or browse the full drop.
              </p>
              <Button variant="pill" size="md" asChild>
                <Link href="/shop">Browse the drop</Link>
              </Button>
            </div>
          ) : (
            <div className="max-w-lg flex flex-col items-start gap-4">
              <Button variant="pill" size="md" asChild>
                <Link href="/shop">Browse the drop</Link>
              </Button>
            </div>
          )}
        </Section>
      </main>
      <Footer />
    </>
  );
}
