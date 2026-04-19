'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useEcom } from '@ecom/react';
import { Heading } from '@/components/ui/Heading';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

type LineItem = {
  id: string;
  title: string;
  variantTitle?: string | null;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  orderNumber: number;
  email: string;
  total: number;
  subtotal?: number;
  shipping?: number;
  financialStatus: string;
  fulfillmentStatus: string;
  createdAt: string;
  lineItems: LineItem[];
  shippingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  } | null;
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { fetcher } = useEcom();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const data = await fetcher<Order>(`/orders/${id}`);
        if (!cancel) setOrder(data);
      } catch (e) {
        if (!cancel) setError(e instanceof Error ? e.message : 'Order not found');
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [fetcher, id]);

  if (loading) return <p className="text-bone/60">Loading…</p>;
  if (error || !order) {
    return (
      <Card variant="base" pad="lg" className="text-center">
        <p className="text-bone/60">{error ?? 'Order not found.'}</p>
        <div className="mt-4">
          <Button variant="ghost" size="md" asChild>
            <Link href="/account/orders">Back to orders</Link>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <Eyebrow>
            Placed{' '}
            {new Date(order.createdAt).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </Eyebrow>
          <Heading variant="m" as="h2" className="mt-1">
            Order #{order.orderNumber}
          </Heading>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={order.financialStatus === 'paid' ? 'success' : 'muted'} size="sm">
            {order.financialStatus || 'pending'}
          </Badge>
          <Badge variant={order.fulfillmentStatus === 'fulfilled' ? 'success' : 'muted'} size="sm">
            {order.fulfillmentStatus || 'processing'}
          </Badge>
        </div>
      </div>

      <Card variant="lift" pad="lg">
        <Eyebrow className="mb-4 block">Items</Eyebrow>
        <ul className="divide-y divide-[var(--color-border)]">
          {order.lineItems.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-3 text-[14px]">
              <div>
                <p className="font-display text-[16px] uppercase leading-tight">{item.title}</p>
                {item.variantTitle ? (
                  <p className="text-[12px] text-bone/60">{item.variantTitle}</p>
                ) : null}
              </div>
              <div className="flex items-center gap-6">
                <span className="text-bone/60">× {item.quantity}</span>
                <span className="font-display text-[16px]">
                  £{((item.price * item.quantity) / 100).toFixed(0)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card variant="base" pad="lg">
          <Eyebrow className="mb-3 block">Summary</Eyebrow>
          <dl className="flex flex-col gap-2 text-[14px]">
            {order.subtotal != null ? (
              <div className="flex justify-between">
                <dt className="text-bone/60">Subtotal</dt>
                <dd>£{(order.subtotal / 100).toFixed(0)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between">
              <dt className="text-bone/60">Shipping</dt>
              <dd>{order.shipping ? `£${(order.shipping / 100).toFixed(0)}` : 'Free'}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <dt className="font-display text-[16px] uppercase">Total</dt>
              <dd className="font-display text-[18px]">£{(order.total / 100).toFixed(0)}</dd>
            </div>
          </dl>
        </Card>

        {order.shippingAddress ? (
          <Card variant="base" pad="lg">
            <Eyebrow className="mb-3 block">Shipping to</Eyebrow>
            <address className="not-italic text-[14px] text-bone/60 leading-relaxed">
              {order.shippingAddress.line1}
              {order.shippingAddress.line2 ? (
                <>
                  <br />
                  {order.shippingAddress.line2}
                </>
              ) : null}
              <br />
              {order.shippingAddress.city}
              {order.shippingAddress.postalCode ? `, ${order.shippingAddress.postalCode}` : ''}
              <br />
              {order.shippingAddress.country}
            </address>
          </Card>
        ) : null}
      </div>

      <div>
        <Button variant="ghost" size="md" asChild>
          <Link href="/account/orders">← Back to orders</Link>
        </Button>
      </div>
    </div>
  );
}
