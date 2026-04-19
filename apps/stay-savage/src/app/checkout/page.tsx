import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Heading } from '@/components/ui/Heading';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { CheckoutClient } from './CheckoutClient';

export const metadata: Metadata = {
  title: 'Checkout',
};

export default function CheckoutPage() {
  return (
    <>
      <main className="flex-1">
        <Section size="auto" pad="md" contain>
          <div className="max-w-3xl mx-auto flex flex-col gap-10">
            <div className="flex flex-col gap-2">
              <Eyebrow>Checkout</Eyebrow>
              <Heading variant="inner" as="h1">
                Secure your kit
              </Heading>
              <p className="text-bone/60 max-w-lg">
                Free UK shipping · 30-day returns · Stripe-powered secure payment.
              </p>
            </div>
            <CheckoutClient />
          </div>
        </Section>
      </main>
    </>
  );
}
