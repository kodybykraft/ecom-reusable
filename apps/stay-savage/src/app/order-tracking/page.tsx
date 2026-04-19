import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { Section } from '@/components/ui/Section';
import { Heading } from '@/components/ui/Heading';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { OrderLookup } from './OrderLookup';

export const metadata: Metadata = {
  title: 'Track Your Order',
  description: 'Look up your Stay Savage order status by email and order number.',
};

export default function OrderTrackingPage() {
  return (
    <>
      <main className="flex-1">
        <Section size="auto" pad="lg" contain>
          <div className="max-w-lg mx-auto flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Eyebrow>Where&apos;s my kit?</Eyebrow>
              <Heading variant="m" as="h1">
                Track your order
              </Heading>
              <p className="text-bone/60">
                Enter your email and order number below.
              </p>
            </div>
            <OrderLookup />
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
