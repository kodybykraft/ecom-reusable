'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ArrowRight } from 'lucide-react';
import { useCart } from '@ecom/react';
import { useUI } from '@/components/Providers';
import { ProductImageGallery } from '@/components/ProductImageGallery';
import { SizeGuide } from '@/components/SizeGuide';

const COLOUR_MAP: Record<string, string> = {
  'Jet Black': '#1a1a1a',
  Black: '#1a1a1a',
  Grey: '#6b7280',
  Olive: '#5c6b4e',
  'Navy Blue': '#1e3a5f',
};

interface ProductClientProps {
  product: any;
  meta: Record<string, any> | null;
}

export function ProductClient({ product, meta }: ProductClientProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { setCartOpen } = useUI();

  const price = product.variants[0]?.price ?? 0;
  const sizes = product.options?.find((o: any) => o.name === 'Size')?.values ?? [];
  const colour = (meta?.color as string) || product.variants[0]?.options?.Color || '';

  const selectedVariant = selectedSize
    ? product.variants.find((v: any) => v.options?.Size === selectedSize)
    : null;
  const stockLevel = selectedVariant?.inventoryQuantity ?? null;

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error('Select a size');
      return;
    }
    if (!selectedVariant) {
      toast.error('Variant not found');
      return;
    }
    try {
      await addItem(selectedVariant.id, quantity);
      toast.success(`${product.title} (${selectedSize}) added`);
      setCartOpen(true);
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
      <ProductImageGallery images={product.images || []} />

      <div>
        {meta?.collection && (
          <p className="font-display text-xs tracking-[0.4em] text-savage mb-3">
            {meta.collection === 'reflective' ? 'REFLECTIVE COLLECTION' : 'OG COLLECTION'}
          </p>
        )}

        <h1 className="font-display text-4xl md:text-5xl tracking-tight text-bone leading-none mb-4">
          {product.title}
        </h1>

        <p className="font-display text-3xl text-bone mb-6">£{(price / 100).toFixed(0)}</p>

        <p className="text-bone/60 mb-8 leading-relaxed">{product.description}</p>

        {/* Colour */}
        {colour && (
          <div className="mb-8">
            <label className="font-display text-xs tracking-[0.3em] text-bone/60 mb-3 block">
              COLOUR — {colour.toUpperCase()}
            </label>
            <div className="flex gap-2">
              <div
                className="w-10 h-10 border-2 border-bone"
                style={{ backgroundColor: COLOUR_MAP[colour] || '#333' }}
                title={colour}
              />
            </div>
          </div>
        )}

        {/* Size */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <label className="font-display text-xs tracking-[0.3em] text-bone/60">
              SIZE {selectedSize && `— ${selectedSize}`}
            </label>
            <SizeGuide />
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size: string) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`px-5 py-3 border font-display text-sm tracking-[0.1em] transition-colors ${
                  selectedSize === size
                    ? 'border-bone bg-bone text-ink'
                    : 'border-border text-bone/70 hover:border-bone hover:text-bone'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          {stockLevel !== null && stockLevel > 0 && stockLevel <= 5 && (
            <p className="text-sm text-savage mt-2 font-display tracking-wider">
              Only {stockLevel} left in {selectedSize}
            </p>
          )}
        </div>

        {/* Quantity */}
        <div className="mb-8">
          <label className="font-display text-xs tracking-[0.3em] text-bone/60 mb-3 block">
            QUANTITY
          </label>
          <div className="flex items-center border border-border w-fit">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 h-12 flex items-center justify-center text-bone/70 hover:text-bone transition-colors"
            >
              −
            </button>
            <span className="w-12 text-center font-display text-sm">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-12 h-12 flex items-center justify-center text-bone/70 hover:text-bone transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Add to Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="group w-full bg-bone text-ink font-display tracking-[0.2em] text-sm py-5 hover:bg-savage hover:text-bone transition-colors flex items-center justify-center gap-2 mb-3"
        >
          ADD TO BAG — £{((price * quantity) / 100).toFixed(0)}
          <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="text-bone/40 text-[11px] text-center tracking-wider mb-8">
          Free UK shipping · 3-5 business days
        </p>

        {/* Specs */}
        {meta && (
          <div className="border-t border-border pt-6 space-y-3">
            {meta.fabric && (
              <div className="flex justify-between text-sm">
                <span className="text-bone/50">Fabric</span>
                <span className="text-bone">{meta.fabric}</span>
              </div>
            )}
            {meta.weight && (
              <div className="flex justify-between text-sm">
                <span className="text-bone/50">Weight</span>
                <span className="text-bone">{meta.weight}</span>
              </div>
            )}
            {meta.fit && (
              <div className="flex justify-between text-sm">
                <span className="text-bone/50">Fit</span>
                <span className="text-bone">{meta.fit}</span>
              </div>
            )}
          </div>
        )}

        {meta?.features && (
          <div className="mt-6 border-t border-border pt-6">
            <ul className="space-y-2">
              {(meta.features as string[]).map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-bone/60">
                  <span className="text-savage mt-0.5 text-xs">●</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Sticky mobile ATC */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-ink border-t border-border lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-display text-sm tracking-[0.1em] text-bone">{product.title}</p>
            <p className="font-display text-bone">£{(price / 100).toFixed(0)}</p>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            className="px-6 py-3 bg-bone text-ink font-display tracking-[0.2em] text-xs hover:bg-savage hover:text-bone transition-colors whitespace-nowrap"
          >
            {selectedSize ? `ADD — ${selectedSize}` : 'SELECT SIZE'}
          </button>
        </div>
      </div>
    </div>
  );
}
