import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { Section } from '@/components/ui/Section';
import { Heading } from '@/components/ui/Heading';
import { Eyebrow } from '@/components/ui/Eyebrow';

export const metadata: Metadata = {
  title: 'Returns & Refund Policy',
};

export default function ReturnsPage() {
  return (
    <>
      <main className="flex-1">
        <Section size="auto" pad="md" contain>
          <div className="max-w-3xl flex flex-col gap-3 mb-10">
            <Eyebrow>Returns</Eyebrow>
            <Heading variant="inner" as="h1">Returns &amp; refunds</Heading>
          </div>
          <div className="prose prose-invert prose-sm max-w-3xl space-y-6 text-bone/60">
          <p>We want you to be satisfied with your purchase. If something is not right, here is how we handle returns.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">Return Window</h2>
          <p>You have 30 days from the date of delivery to return your item(s). Items must be unworn, unwashed, and in their original condition with all tags attached.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">How to Return</h2>
          <p>To start a return, email us at orders@stay-savage.com with your order number and reason for return. We will provide you with the return address and any further instructions.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">Return Shipping</h2>
          <p>The customer is responsible for return shipping costs. We recommend using a tracked service. For faulty or incorrect items, we will cover the return shipping cost — contact us and we will arrange this.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">Exchanges</h2>
          <p>We accept exchanges for a different size. Subject to availability. Email orders@stay-savage.com with your order number and the size you need.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">Refunds</h2>
          <p>Once we receive and inspect your returned item, we will process your refund to the original payment method within 14 days. You will receive an email confirmation when your refund has been processed.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">Faulty Items</h2>
          <p>If you receive a faulty or damaged item, contact us immediately at orders@stay-savage.com. We will arrange a free return and either replace the item or issue a full refund.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">Non-Returnable Items</h2>
          <p>Items that have been worn, washed, altered, or have had tags removed cannot be returned. Items returned after the 30-day window will not be accepted.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">Your Statutory Rights</h2>
          <p>This policy does not affect your statutory rights under the Consumer Rights Act 2015.</p>

          <div className="glass  p-6 mt-8">
            <p className="text-foreground font-bold mb-2">Returns Address</p>
            <p>Stay Savage LTD<br />118 Plashet Road<br />Plaistow, London<br />E13 0QS</p>
          </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
