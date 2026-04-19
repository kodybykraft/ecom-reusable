import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { Section } from '@/components/ui/Section';
import { Heading } from '@/components/ui/Heading';
import { Eyebrow } from '@/components/ui/Eyebrow';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
};

export default function TermsPage() {
  return (
    <>
      <main className="flex-1">
        <Section size="auto" pad="md" contain>
          <div className="max-w-3xl flex flex-col gap-3 mb-10">
            <Eyebrow>Legal</Eyebrow>
            <Heading variant="inner" as="h1">Terms &amp; Conditions</Heading>
          </div>
          <div className="prose prose-invert prose-sm max-w-3xl space-y-6 text-bone/60">
          <p><strong>Last updated:</strong> April 2026</p>
          <p>These terms and conditions govern your use of stay-savage.com and any purchases made through it. By using this website, you agree to these terms in full.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">1. Company Information</h2>
          <p>This website is operated by Stay Savage LTD, a company registered in England and Wales (Company Number: 14703196). Registered office: 118 Plashet Road, Plaistow, London, England, E13 0QS. Contact: orders@stay-savage.com.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">2. Products</h2>
          <p>All tracksuits are sold as complete sets (hoodie and joggers). Products cannot be purchased separately. All prices are in GBP (£) and are final — Stay Savage LTD is not VAT registered. We reserve the right to change prices at any time without notice. Images are for illustration purposes; actual products may vary slightly.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">3. Orders & Payment</h2>
          <p>By placing an order, you are making an offer to purchase. We reserve the right to refuse any order. Payment is processed securely via Stripe. We accept major credit and debit cards. Your order is confirmed when you receive a confirmation email. We are not responsible for delays caused by incorrect shipping information provided by you.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">4. Shipping</h2>
          <p>We offer free UK shipping on all orders via Royal Mail. Estimated delivery is 3-5 business days from dispatch. Tracking information will be provided via email. We are not liable for delays caused by Royal Mail or circumstances beyond our control. We currently ship to UK addresses only.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">5. Returns & Refunds</h2>
          <p>You may return items within 30 days of delivery. Items must be unworn, unwashed, and in their original condition with all tags attached. The customer is responsible for return shipping costs unless the item is faulty or incorrect. We offer exchanges and refunds. Refunds will be processed to the original payment method within 14 days of receiving the returned item. For faulty items, we will cover return shipping costs.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">6. Consumer Rights</h2>
          <p>Your statutory rights under the Consumer Rights Act 2015 and the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013 are not affected by these terms. You have the right to cancel your order within 14 days of receiving your goods without giving any reason.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">7. Intellectual Property</h2>
          <p>All content on this website, including but not limited to text, images, logos, and designs, is the property of Stay Savage LTD and is protected by copyright and trademark laws. You may not reproduce, distribute, or use any content without our written permission.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">8. Limitation of Liability</h2>
          <p>Stay Savage LTD shall not be liable for any indirect, incidental, or consequential damages arising from the use of this website or the purchase of our products, except where such liability cannot be excluded by law.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">9. Governing Law</h2>
          <p>These terms are governed by the laws of England and Wales. Any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">10. Contact</h2>
          <p>For questions about these terms, contact us at orders@stay-savage.com.</p>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
