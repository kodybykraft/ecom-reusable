import type { Metadata } from 'next';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { Section } from '@/components/ui/Section';
import { Heading } from '@/components/ui/Heading';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ecom } from '@/lib/ecom';

export const metadata: Metadata = {
  title: 'Order Confirmed',
  robots: { index: false, follow: false },
};

type OrderLineItem = {
  id: string;
  title: string;
  variantTitle?: string | null;
  price: number;
  quantity: number;
};

type Order = {
  orderNumber: string;
  email: string;
  total: number;
  lineItems?: OrderLineItem[];
};

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderId } = await searchParams;

  let order: Order | null = null;
  if (orderId) {
    try {
      order = (await ecom.orders.getById(orderId)) as unknown as Order;
    } catch {
      // Fallback to generic confirmation if lookup fails
    }
  }

  return (
    <>
      <main className="flex-1">
        <Section size="auto" pad="lg" contain>
          <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-[var(--color-success)] bg-[var(--color-success)]/10 text-green-500">
              <Check className="h-7 w-7" />
            </span>
            <div className="flex flex-col gap-2">
              <Eyebrow>Confirmed</Eyebrow>
              <Heading variant="l" as="h1" align="center">
                You&apos;re in.
              </Heading>
              {order ? (
                <p className="text-bone/60">
                  Order <span className="text-bone">#{order.orderNumber}</span>
                </p>
              ) : null}
            </div>

            <Card variant="lift" pad="lg" className="w-full text-left">
              {order ? (
                <div className="flex flex-col gap-5">
                  <dl className="flex flex-col gap-3 text-[14px]">
                    <div className="flex justify-between">
                      <dt className="text-bone/60">Email</dt>
                      <dd>{order.email}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-bone/60">Shipping</dt>
                      <dd>Free · Royal Mail 3–5 days</dd>
                    </div>
                    <div className="flex justify-between border-t border-border pt-3">
                      <dt className="font-display text-[16px] uppercase">Total</dt>
                      <dd className="font-display text-[18px]">
                        £{(order.total / 100).toFixed(0)}
                      </dd>
                    </div>
                  </dl>

                  {order.lineItems && order.lineItems.length > 0 ? (
                    <div className="border-t border-border pt-5">
                      <Eyebrow className="mb-3 block">Items</Eyebrow>
                      <ul className="flex flex-col gap-2 text-[13px]">
                        {order.lineItems.map((item) => (
                          <li key={item.id} className="flex justify-between gap-4">
                            <span className="text-bone/60">
                              {item.title}
                              {item.variantTitle ? ` — ${item.variantTitle}` : ''} × {item.quantity}
                            </span>
                            <span>£{((item.price * item.quantity) / 100).toFixed(0)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ) : (
                <p className="text-bone/60 text-center">
                  Your order has been placed. Check your email for confirmation details.
                </p>
              )}
            </Card>

            <p className="text-[13px] text-bone/60 max-w-lg">
              A confirmation email has been sent. We&apos;ll send a tracking number once your order ships.
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              <Button variant="pill" size="md" asChild>
                <Link href="/shop">Keep shopping</Link>
              </Button>
              <Button variant="ghost" size="md" asChild>
                <Link href="/order-tracking">Track order</Link>
              </Button>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
