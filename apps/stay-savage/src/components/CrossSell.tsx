import Image from 'next/image';
import Link from 'next/link';

interface CrossSellProps {
  products: any[];
  title?: string;
}

export function CrossSell({ products, title = 'Complete the Look' }: CrossSellProps) {
  if (!products.length) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-6">{title.toUpperCase()}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.slice(0, 4).map((product) => {
          const image = product.images?.[0];
          const price = product.variants?.[0]?.price ?? 0;
          return (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group glass  overflow-hidden hover:border-foreground/20 transition-all duration-300"
            >
              <div className="aspect-[3/4] relative overflow-hidden">
                {image ? (
                  <Image
                    src={image.url}
                    alt={image.altText || product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-savage-charcoal" />
                )}
              </div>
              <div className="p-3">
                <h3 className="text-sm font-bold group-hover:text-accent transition-colors truncate">
                  {product.title}
                </h3>
                <p className="text-accent font-bold mt-1">£{(price / 100).toFixed(0)}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
