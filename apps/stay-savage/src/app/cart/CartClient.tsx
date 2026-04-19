'use client';

import Link from 'next/link';
import { useCart } from '@ecom/react';
import { Minus, Plus, X, Truck, RotateCcw, Shield } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Heading } from '@/components/ui/Heading';

export function CartClient() {
  const { cart, loading, updateItem, removeItem } = useCart();

  if (loading) {
    return (
      <div className="py-24 text-center text-bone/60">
        Loading cart...
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center text-center gap-5 max-w-lg mx-auto py-20">
        <Eyebrow muted>Nothing in the pack</Eyebrow>
        <Heading variant="m" as="h2" align="center">
          Your cart is empty
        </Heading>
        <p className="text-bone/60">
          The grind does not wait. Neither should you.
        </p>
        <Button variant="pill" size="lg" asChild>
          <Link href="/shop">Start shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12">
      <ul className="flex flex-col gap-4">
        {cart.items.map((item) => (
          <li key={item.id}>
            <Card variant="base" pad="md" className="flex gap-4">
              <Link
                href={`/products/${item.variant.product?.slug || ''}`}
                className="h-24 w-20 shrink-0 overflow-hidden rounded-[var(--radius)] bg-card border border-border flex items-center justify-center"
              >
                <span className="text-[10px] uppercase tracking-[var(--tracking-eyebrow)] text-bone/40">
                  {(item.variant.product?.title ?? 'SS').slice(0, 2)}
                </span>
              </Link>
              <div className="flex flex-1 flex-col gap-3 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-display text-[18px] uppercase leading-tight truncate">
                      {item.variant.product?.title || item.variant.title}
                    </p>
                    <p className="text-[13px] text-bone/60 mt-0.5">
                      {item.variant.title}
                    </p>
                    <p className="text-[12px] text-bone/40 mt-1">
                      £{(item.variant.price / 100).toFixed(0)} each
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-bone/60 hover:text-savage transition-colors"
                    aria-label="Remove item"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center rounded-[var(--radius)] border border-border">
                    <button
                      type="button"
                      onClick={() => updateItem(item.id, Math.max(0, item.quantity - 1))}
                      className="h-9 w-9 inline-flex items-center justify-center text-bone/60 hover:text-bone"
                      aria-label="Decrease"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-10 text-center text-[14px] font-medium">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateItem(item.id, item.quantity + 1)}
                      className="h-9 w-9 inline-flex items-center justify-center text-bone/60 hover:text-bone"
                      aria-label="Increase"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="font-display text-[20px]">
                    £{((item.variant.price * item.quantity) / 100).toFixed(0)}
                  </span>
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ul>

      <aside className="lg:sticky lg:top-24 self-start">
        <Card variant="lift" pad="lg" className="flex flex-col gap-6">
          <Eyebrow>Order Summary</Eyebrow>
          <dl className="flex flex-col gap-3 text-[14px]">
            <div className="flex justify-between">
              <dt className="text-bone/60">
                Subtotal ({cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'})
              </dt>
              <dd className="font-medium">£{(cart.subtotal / 100).toFixed(0)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-bone/60">Shipping</dt>
              <dd className="font-medium text-green-500">Free</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3">
              <dt className="font-display text-[18px] uppercase">Total</dt>
              <dd className="font-display text-[22px]">
                £{(cart.subtotal / 100).toFixed(0)}
              </dd>
            </div>
          </dl>
          <div className="flex flex-col gap-3">
            <Button variant="pill" size="lg" fullWidth asChild>
              <Link href="/checkout">Proceed to checkout</Link>
            </Button>
            <Button variant="ghost" size="md" fullWidth asChild>
              <Link href="/shop">Continue shopping</Link>
            </Button>
          </div>
          <ul className="flex flex-col gap-3 text-[13px] text-bone/60 pt-2">
            <li className="flex items-center gap-2">
              <Truck className="h-4 w-4 shrink-0" />
              <span>Free UK shipping. 3–5 business days.</span>
            </li>
            <li className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 shrink-0" />
              <span>30-day returns. Exchanges accepted.</span>
            </li>
            <li className="flex items-center gap-2">
              <Shield className="h-4 w-4 shrink-0" />
              <span>Secure checkout. Stripe-powered.</span>
            </li>
          </ul>
        </Card>
      </aside>
    </div>
  );
}
