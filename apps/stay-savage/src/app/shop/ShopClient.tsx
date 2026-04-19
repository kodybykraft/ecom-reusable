'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { FilterPanel, SortSelect } from '@/components/FilterPanel';
import { cn } from '@/lib/utils';

type ProductImage = { url: string; altText?: string | null };
type ProductVariant = { price: number };
type Product = {
  id: string;
  slug: string;
  title: string;
  images?: ProductImage[];
  variants?: ProductVariant[];
  metadata?: Record<string, unknown> | null;
};

export interface ShopClientProps {
  products: Product[];
  total: number;
}

export function ShopClient({ products, total }: ShopClientProps) {
  const search = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const categoryFilter = search.get('category');
  const colorFilter = search.get('color');
  const sort = search.get('sort') ?? 'newest';

  const filtered = useMemo(() => {
    let result = [...products];
    if (categoryFilter) {
      result = result.filter(
        (p) => (p.metadata as { collection?: string } | null)?.collection === categoryFilter
      );
    }
    if (colorFilter) {
      result = result.filter((p) => p.title.toLowerCase().includes(colorFilter.toLowerCase()));
    }
    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => (a.variants?.[0]?.price ?? 0) - (b.variants?.[0]?.price ?? 0));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.variants?.[0]?.price ?? 0) - (a.variants?.[0]?.price ?? 0));
        break;
      default:
        break;
    }
    return result;
  }, [products, categoryFilter, colorFilter, sort]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 lg:gap-12">
      {/* Desktop filter rail */}
      <div className="hidden lg:block">
        <FilterPanel />
      </div>

      {/* Mobile filter trigger */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-border">
          <button
            onClick={() => setMobileOpen(true)}
            className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[var(--tracking-eyebrow)] text-bone/60"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filter
          </button>
          <SortSelect />
        </div>
      </div>

      {/* Mobile bottom sheet */}
      <div
        className={cn(
          'lg:hidden fixed inset-0 z-[80] bg-black/60 transition-opacity',
          mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={cn(
          'lg:hidden fixed inset-x-0 bottom-0 z-[90] bg-[var(--color-background)] border-t border-border rounded-t-[var(--radius-lg)] max-h-[85dvh] overflow-y-auto transition-transform duration-300',
          mobileOpen ? 'translate-y-0' : 'translate-y-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <Eyebrow>Filter</Eyebrow>
          <button onClick={() => setMobileOpen(false)} aria-label="Close filters">
            <X className="h-5 w-5 text-bone/60" />
          </button>
        </div>
        <div className="px-6 py-6">
          <FilterPanel onApply={() => setMobileOpen(false)} />
        </div>
      </aside>

      {/* Grid */}
      <div>
        <div className="hidden lg:flex items-center justify-between pb-5 mb-5 border-b border-border">
          <p className="text-[13px] uppercase tracking-[var(--tracking-eyebrow)] text-bone/60">
            {filtered.length} of {total} products
          </p>
          <SortSelect />
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filtered.map((product) => {
              const primary = product.images?.[0];
              const secondary = product.images?.[1];
              const price = product.variants?.[0]?.price ?? 0;
              const collection = (product.metadata as { collection?: string } | null)?.collection;
              return (
                <Link key={product.id} href={`/products/${product.slug}`} className="group block">
                  <Card variant="product" pad="none" interactive>
                    <div className="aspect-[3/4] relative overflow-hidden">
                      {primary ? (
                        <>
                          <Image
                            src={primary.url}
                            alt={primary.altText || product.title}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 40vw, 30vw"
                            className={cn(
                              'object-cover transition-opacity duration-500',
                              secondary ? 'group-hover:opacity-0' : 'group-hover:scale-[1.03]'
                            )}
                            loading="lazy"
                          />
                          {secondary ? (
                            <Image
                              src={secondary.url}
                              alt={secondary.altText || product.title}
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 40vw, 30vw"
                              className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                              loading="lazy"
                            />
                          ) : null}
                        </>
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
                      <div>
                        <p className="font-display text-[16px] md:text-[18px] uppercase line-clamp-1">
                          {product.title}
                        </p>
                        <p className="text-[12px] text-bone/60 mt-0.5">
                          {collection === 'reflective' ? '330 GSM' : '280 GSM'}
                        </p>
                      </div>
                      <p className="font-display text-[18px] md:text-[20px]">£{Math.round(price / 100)}</p>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-4 py-16">
            <Eyebrow muted>Nothing here</Eyebrow>
            <p className="text-bone/60 max-w-md">
              No products match your filters. Try clearing them or come back when the next drop hits.
            </p>
            <Button variant="ghost" size="md" asChild>
              <Link href="/shop">Clear filters</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
