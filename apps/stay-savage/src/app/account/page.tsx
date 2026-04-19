'use client';

import Link from 'next/link';
import { useOrders } from '@ecom/react';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Heading } from '@/components/ui/Heading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function AccountDashboardPage() {
  const { orders, loading } = useOrders();
  const recent = orders.slice(0, 3);

  return (
    <div className="flex flex-col gap-10">
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card variant="lift" pad="lg">
          <Eyebrow>Orders</Eyebrow>
          <p className="font-display text-[40px] leading-none mt-2">
            {loading ? '—' : orders.length}
          </p>
          <p className="text-[13px] text-bone/60 mt-1">Lifetime orders placed</p>
          <div className="mt-5">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/account/orders">View all</Link>
            </Button>
          </div>
        </Card>
        <Card variant="lift" pad="lg">
          <Eyebrow>Next drop</Eyebrow>
          <p className="font-display text-[40px] leading-none mt-2">TBA</p>
          <p className="text-[13px] text-bone/60 mt-1">
            Sign up to the mailing list for first access.
          </p>
          <div className="mt-5">
            <Button variant="pill" size="sm" asChild>
              <Link href="/shop">Shop the drop</Link>
            </Button>
          </div>
        </Card>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Heading variant="m" as="h2">
            Recent orders
          </Heading>
          <Link
            href="/account/orders"
            className="text-[12px] uppercase tracking-[var(--tracking-eyebrow)] text-bone/60 hover:text-bone"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <p className="text-bone/60">Loading…</p>
        ) : recent.length === 0 ? (
          <Card variant="base" pad="lg" className="text-center">
            <p className="text-bone/60">No orders yet.</p>
            <div className="mt-4">
              <Button variant="pill" size="md" asChild>
                <Link href="/shop">Shop the drop</Link>
              </Button>
            </div>
          </Card>
        ) : (
          <ul className="flex flex-col gap-3">
            {recent.map((order) => (
              <li key={order.id}>
                <Link href={`/account/orders/${order.id}`} className="block">
                  <Card variant="base" pad="md" interactive>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-display text-[18px] uppercase leading-none">
                          Order #{order.orderNumber}
                        </p>
                        <p className="text-[12px] text-bone/60 mt-1">
                          {new Date(order.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                          {' · '}
                          {order.lineItems.length} item{order.lineItems.length === 1 ? '' : 's'}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={order.fulfillmentStatus === 'fulfilled' ? 'success' : 'muted'} size="sm">
                          {order.fulfillmentStatus || 'processing'}
                        </Badge>
                        <span className="font-display text-[18px]">
                          £{(order.total / 100).toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
