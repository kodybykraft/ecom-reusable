import { formatMoney } from '@ecom/core';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  let result = { data: [] as Array<{
    id: string;
    slug: string;
    title: string;
    description: string | null;
    variants: Array<{ price: number; inventoryQuantity: number }>;
    images: Array<{ url: string; altText: string | null }>;
  }>, total: 0, totalPages: 0, page: 1, pageSize: 12 };

  try {
    const { ecom } = await import('../../lib/ecom');
    result = await ecom.products.list(
      { status: 'active', search: params.search },
      { page, pageSize: 12 },
    );
  } catch {
    // DB not running
  }

  return (
    <div>
      <h1>Products</h1>

      <form method="get" style={{ marginBottom: '1.5rem' }}>
        <input
          name="search"
          defaultValue={params.search}
          placeholder="Search products..."
          style={{ padding: '0.5rem 1rem', border: '1px solid #ddd', borderRadius: '4px', width: '300px' }}
        />
        <button type="submit" style={{ marginLeft: '0.5rem', padding: '0.5rem 1rem' }}>
          Search
        </button>
      </form>

      {result.data.length > 0 ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {result.data.map((product) => (
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

          {result.totalPages > 1 && (
            <div style={{ marginTop: '2rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`/products?page=${p}${params.search ? `&search=${params.search}` : ''}`}
                  style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    background: p === page ? '#000' : '#fff',
                    color: p === page ? '#fff' : '#000',
                    textDecoration: 'none',
                  }}
                >
                  {p}
                </a>
              ))}
            </div>
          )}
        </>
      ) : (
        <p style={{ color: '#666' }}>No products found.</p>
      )}
    </div>
  );
}
