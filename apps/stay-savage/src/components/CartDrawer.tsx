'use client';

import Link from 'next/link';
import Image from 'next/image';
import { X, Minus, Plus, ArrowRight } from 'lucide-react';
import { useCart } from '@ecom/react';
import { useUI } from '@/components/Providers';

export function CartDrawer() {
  const { cartOpen, setCartOpen } = useUI();
  const { cart, updateItem, removeItem } = useCart();
  const items = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? 0;

  return (
    <>
      <div
        onClick={() => setCartOpen(false)}
        className={`fixed inset-0 z-[60] bg-ink/70 backdrop-blur-sm transition-opacity ${
          cartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />
      <aside
        className={`fixed top-0 right-0 z-[70] h-full w-full sm:w-[440px] bg-ink border-l border-border shadow-2xl flex flex-col transition-transform duration-300 ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <p className="font-display text-lg tracking-[0.2em] text-bone">
            YOUR BAG ({cart?.itemCount ?? 0})
          </p>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            aria-label="Close cart"
            className="text-bone/70 hover:text-bone transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <p className="font-display text-2xl tracking-[0.1em] text-bone">EMPTY.</p>
              <p className="text-sm text-bone/50">The grind does not wait.</p>
              <Link
                href="/shop"
                onClick={() => setCartOpen(false)}
                className="font-display text-sm tracking-[0.2em] text-savage hover:text-bone transition-colors"
              >
                SHOP THE DROP →
              </Link>
            </div>
          ) : (
            items.map((item) => {
              const title = item.variant.product?.title ?? 'Product';
              const variantLabel = item.variant.title;
              return (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-24 bg-card overflow-hidden flex-shrink-0">
                    <div className="w-full h-full bg-card flex items-center justify-center text-[10px] text-bone/30 font-display tracking-widest">
                      {title.slice(0, 2)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm tracking-[0.1em] text-bone uppercase">
                      {title}
                    </p>
                    <p className="text-xs text-bone/50 mt-1">{variantLabel}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-border">
                        <button
                          type="button"
                          onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                          aria-label="Decrease quantity"
                          className="px-2 py-1 text-bone/70 hover:text-bone"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-display">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateItem(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="px-2 py-1 text-bone/70 hover:text-bone"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-display text-sm text-bone">
                          £{((item.variant.price * item.quantity) / 100).toFixed(0)}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-[10px] tracking-widest text-bone/40 hover:text-savage transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border p-5 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-bone/70">Subtotal</span>
              <span className="font-display text-bone">£{(subtotal / 100).toFixed(0)}</span>
            </div>
            <p className="text-[11px] text-bone/50">Shipping &amp; taxes calculated at checkout.</p>
            <Link
              href="/checkout"
              onClick={() => setCartOpen(false)}
              className="w-full bg-bone text-ink font-display tracking-[0.2em] text-sm py-4 hover:bg-savage hover:text-bone transition-colors flex items-center justify-center gap-2"
            >
              CHECKOUT <ArrowRight className="size-4" />
            </Link>
            <button
              type="button"
              onClick={() => setCartOpen(false)}
              className="w-full text-xs text-bone/60 hover:text-bone tracking-wider underline transition-colors"
            >
              Continue shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
