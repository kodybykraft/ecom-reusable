'use client';

import Link from 'next/link';
import { useOrders } from '@ecom/react';
import { Heading } from '@/components/ui/Heading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function OrdersPage() {
  const { orders, loading } = useOrders();

  return (
    <div className="flex flex-col gap-6">
      <Heading variant="m" as="h2">
        Your orders
      </Heading>

      {loading ? (
        <p className="text-bone/60">Loading…</p>
      ) : orders.length === 0 ? (
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
          {orders.map((order) => (
            <li key={order.id}>
              <Link href={`/account/orders/${order.id}`} className="block">
                <Card variant="base" pad="md" interactive>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
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
                    <div className="flex items-center gap-3">
                      <Badge variant={order.fulfillmentStatus === 'fulfilled' ? 'success' : 'muted'} size="sm">
                        {order.fulfillmentStatus || 'processing'}
                      </Badge>
                      <Badge
                        variant={order.financialStatus === 'paid' ? 'success' : 'muted'}
                        size="sm"
                      >
                        {order.financialStatus || 'pending'}
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
    </div>
  );
}
