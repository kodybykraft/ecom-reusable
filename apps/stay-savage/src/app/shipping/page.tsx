import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { Section } from '@/components/ui/Section';
import { Heading } from '@/components/ui/Heading';
import { Eyebrow } from '@/components/ui/Eyebrow';

export const metadata: Metadata = {
  title: 'Shipping Information',
};

export default function ShippingPage() {
  return (
    <>
      <main className="flex-1">
        <Section size="auto" pad="md" contain>
          <div className="max-w-3xl flex flex-col gap-3 mb-10">
            <Eyebrow>Shipping</Eyebrow>
            <Heading variant="inner" as="h1">Delivery &amp; dispatch</Heading>
          </div>
          <div className="prose prose-invert prose-sm max-w-3xl space-y-6 text-bone/60">

          <div className="glass  p-6 mb-8">
            <h2 className="text-2xl font-bold text-accent mb-4">FREE UK SHIPPING</h2>
            <p className="text-foreground">All orders ship free within the United Kingdom. No minimum order value.</p>
          </div>

          <h2 className="text-xl font-bold text-foreground mt-8">Delivery Timeframe</h2>
          <p>Orders are dispatched within 1-2 business days. Delivery via Royal Mail typically takes 3-5 business days from dispatch. Total estimated delivery time: 4-7 business days from placing your order.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">Tracking</h2>
          <p>All orders include tracking. You will receive a tracking number via email once your order has been dispatched. You can track your order through the Royal Mail website.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">Order Processing</h2>
          <p>Orders placed before 2pm on a business day will typically be dispatched the same day or the next business day. Orders placed on weekends or bank holidays will be processed on the next business day.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">Delivery Area</h2>
          <p>We currently ship to UK addresses only. International shipping is not available at this time. We plan to expand to international shipping in the future.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">Delivery Issues</h2>
          <p>If your order has not arrived within 10 business days of dispatch, please contact us at orders@stay-savage.com with your order number and we will investigate with Royal Mail.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">Contact</h2>
          <p>For shipping queries: orders@stay-savage.com</p>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
