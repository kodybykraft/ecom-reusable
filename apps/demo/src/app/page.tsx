import { formatMoney } from '@ecom/core';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { ecom } = await import('../lib/ecom');
  let products: Array<{
    id: string;
    slug: string;
    title: string;
    variants: Array<{ price: number }>;
    images: Array<{ url: string; altText: string | null }>;
  }> = [];

  try {
    const result = await ecom.products.list({ status: 'active' }, { pageSize: 8 });
    products = result.data;
  } catch {
    // DB may not be running yet
  }

  return (
    <div>
      <h1>Welcome to the Demo Store</h1>
      <p>Powered by @ecom packages</p>

      {products.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
          {products.map((product) => (
            <a
              key={product.id}
              href={`/products/${product.slug}`}
              style={{ border: '1px solid #eee', borderRadius: '8px', padding: '1rem', textDecoration: 'none', color: 'inherit' }}
            >
              {product.images[0] && (
                <img
                  src={product.images[0].url}
                  alt={product.images[0].altText ?? product.title}
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }}
                />
              )}
              <h3 style={{ margin: '0.5rem 0 0.25rem' }}>{product.title}</h3>
              {product.variants[0] && (
                <p style={{ color: '#666', margin: 0 }}>
                  {formatMoney(product.variants[0].price)}
                </p>
              )}
            </a>
          ))}
        </div>
      ) : (
        <p style={{ color: '#666', marginTop: '2rem' }}>
          No products yet. Run <code>pnpm db:seed</code> to add sample data.
        </p>
      )}
    </div>
  );
}
