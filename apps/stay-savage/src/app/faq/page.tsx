import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/components/Footer';
import { Section } from '@/components/ui/Section';
import { Heading } from '@/components/ui/Heading';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about Stay Savage tracksuits — sizing, shipping, returns, fabric, and orders.',
};

const faqs = [
  {
    q: 'What GSM are Stay Savage tracksuits?',
    a: 'The OG Series is 280 GSM heavyweight fleece. Uses 80% Ringspun Combed Cotton / 20% Polyester.',
  },
  {
    q: 'Do tracksuits run true to size?',
    a: 'The OG Series has a drop shoulder relaxed fit — true to size is recommended.',
  },
  {
    q: 'Are these sold as sets or separately?',
    a: 'All tracksuits are sold as complete sets — hoodie and joggers together. They cannot be purchased separately.',
  },
  {
    q: 'How much does shipping cost?',
    a: 'Shipping is free on all UK orders. We ship via Royal Mail with tracking. Estimated delivery is 3-5 business days.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'Currently we ship to UK addresses only. International shipping is planned for the future.',
  },
  {
    q: 'What is your returns policy?',
    a: 'You have 30 days from delivery to return items. They must be unworn, unwashed, and in original condition with tags. Customer pays return shipping unless the item is faulty. We accept exchanges and refunds.',
  },
  {
    q: 'How do I start a return or exchange?',
    a: 'Email orders@stay-savage.com with your order number and reason. We will provide instructions and the return address.',
  },
  {
    q: 'How long do refunds take?',
    a: 'Refunds are processed within 14 days of receiving the returned item, back to the original payment method.',
  },
  {
    q: 'How durable is the Stay Savage logo?',
    a: 'The Stay Savage logo is heat-pressed onto every piece. It holds through every wash and every session. Built to last as long as you do.',
  },
  {
    q: 'How do I care for my tracksuit?',
    a: 'Machine wash cold (30°C). Turn inside out before washing. Do not bleach. Tumble dry low. Cool iron inside out — avoid the print area. Do not dry clean.',
  },
  {
    q: 'How do I track my order?',
    a: 'You will receive a tracking number via email once your order ships. Track it on the Royal Mail website.',
  },
  {
    q: 'Can I change or cancel my order?',
    a: 'Contact orders@stay-savage.com as soon as possible. We can change or cancel orders that have not yet been dispatched.',
  },
];

export default function FAQPage() {
  return (
    <>
      <main className="flex-1">
        <Section size="auto" pad="md" contain>
          <div className="max-w-3xl flex flex-col gap-3 mb-12">
            <Eyebrow>FAQ</Eyebrow>
            <Heading variant="inner" as="h1">
              Straight answers.
            </Heading>
            <p className="text-bone/60">
              Common questions. No fluff. If something&apos;s missing, drop us a message.
            </p>
          </div>

          <div className="max-w-3xl">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-border py-6">
                <h3 className="font-body text-[17px] font-semibold text-bone mb-2 normal-case">
                  {faq.q}
                </h3>
                <p className="text-bone/60 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 max-w-3xl flex flex-col items-start gap-4">
            <Eyebrow>Still stuck?</Eyebrow>
            <Button variant="pill" size="md" asChild>
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
