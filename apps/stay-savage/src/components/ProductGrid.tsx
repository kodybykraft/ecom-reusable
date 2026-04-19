import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

type Product = {
  name: string;
  colour: string;
  price: string;
  img: string;
  slug: string;
};

const products: Product[] = [
  { name: 'OG Tracksuit', colour: 'Black', price: '£100', img: '/images/lifestyle/front-black-v3.jpg', slug: 'og-tracksuit-black' },
  { name: 'OG Tracksuit', colour: 'Navy', price: '£100', img: '/images/lifestyle/front-navy.jpg', slug: 'og-tracksuit-navy' },
  { name: 'OG Tracksuit', colour: 'Olive', price: '£100', img: '/images/lifestyle/front-olive.jpg', slug: 'og-tracksuit-olive' },
  { name: 'OG Tracksuit', colour: 'Grey', price: '£100', img: '/images/lifestyle/front-grey-v2.jpg', slug: 'og-tracksuit-grey' },
];

export function ProductGrid({ dbProducts }: { dbProducts?: { id: string; slug: string; title: string; images?: { url: string }[]; variants?: { price: number }[] }[] }) {
  const items = dbProducts && dbProducts.length > 0
    ? dbProducts.slice(0, 4).map((p) => ({
        name: p.title,
        colour: '',
        price: `£${Math.round((p.variants?.[0]?.price ?? 10000) / 100)}`,
        img: p.images?.[0]?.url ?? '/images/lifestyle/front-black-v3.jpg',
        slug: p.slug,
      }))
    : products;

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="flex items-end justify-between mb-10 md:mb-14">
          <div>
            <p className="font-display text-xs tracking-[0.4em] text-savage mb-3">DROP 01</p>
            <h2 className="font-display text-5xl md:text-7xl tracking-tight text-bone leading-none">
              THE COLLECTION.
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden md:inline-flex items-center gap-2 font-display text-sm tracking-[0.2em] text-bone/70 hover:text-bone transition-colors"
          >
            VIEW ALL <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {items.map((p) => (
            <Link key={p.slug} href={`/products/${p.slug}`} className="group block">
              <div className="relative overflow-hidden bg-card aspect-[3/4]">
                <Image
                  src={p.img}
                  alt={`${p.name}${p.colour ? ` — ${p.colour}` : ''}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                  <span className="font-display text-xs tracking-[0.2em] text-bone bg-ink/70 backdrop-blur-sm px-3 py-2">
                    QUICK ADD
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-start justify-between gap-2">
                <div>
                  <p className="font-display text-base tracking-[0.1em] text-bone">
                    {p.name.toUpperCase()}
                  </p>
                  {p.colour && <p className="text-xs text-bone/50 mt-1">{p.colour}</p>}
                </div>
                <p className="font-display text-base text-bone">{p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
