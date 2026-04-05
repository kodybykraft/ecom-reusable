import { formatMoney } from '@ecom/core';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getProduct(slug: string) {
  try {
    const { ecom } = await import('../../../lib/ecom');
    return await ecom.products.getBySlug(slug);
  } catch {
    return null;
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const defaultVariant = product.variants[0];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
      <div>
        {product.images.length > 0 ? (
          <div>
            <img
              src={product.images[0].url}
              alt={product.images[0].altText ?? product.title}
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </div>
        ) : (
          <div style={{ background: '#f5f5f5', height: '400px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
            No image
          </div>
        )}
      </div>

      <div>
        <h1 style={{ margin: '0 0 0.5rem' }}>{product.title}</h1>

        {defaultVariant && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {formatMoney(defaultVariant.price)}
            </span>
            {defaultVariant.compareAtPrice && defaultVariant.compareAtPrice > defaultVariant.price && (
              <span style={{ textDecoration: 'line-through', color: '#999' }}>
                {formatMoney(defaultVariant.compareAtPrice)}
              </span>
            )}
          </div>
        )}

        {product.description && (
          <p style={{ color: '#555', lineHeight: 1.6 }}>{product.description}</p>
        )}

        {product.options.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            {product.options.map((option) => (
              <div key={option.name} style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                  {option.name}
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {option.values.map((value) => (
                    <span
                      key={value}
                      style={{ padding: '0.5rem 1rem', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          style={{
            background: '#000',
            color: '#fff',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '6px',
            fontSize: '1rem',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          Add to Cart
        </button>

        {defaultVariant && (
          <p style={{ color: '#666', fontSize: '0.875rem', marginTop: '0.75rem' }}>
            {defaultVariant.inventoryQuantity > 0
              ? `${defaultVariant.inventoryQuantity} in stock`
              : 'Out of stock'}
            {defaultVariant.sku && ` · SKU: ${defaultVariant.sku}`}
          </p>
        )}
      </div>
    </div>
  );
}
