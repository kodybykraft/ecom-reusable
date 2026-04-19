import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { Section } from '@/components/ui/Section';
import { Heading } from '@/components/ui/Heading';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { CartClient } from './CartClient';

export const metadata: Metadata = {
  title: 'Cart',
};

export default function CartPage() {
  return (
    <>
      <main className="flex-1">
        <Section size="auto" pad="md" contain>
          <div className="flex flex-col gap-2 mb-10">
            <Eyebrow>Your Cart</Eyebrow>
            <Heading variant="inner" as="h1">
              Pre-checkout
            </Heading>
          </div>
          <CartClient />
        </Section>
      </main>
      <Footer />
    </>
  );
}
