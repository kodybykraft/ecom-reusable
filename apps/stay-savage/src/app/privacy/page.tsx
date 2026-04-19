import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { Section } from '@/components/ui/Section';
import { Heading } from '@/components/ui/Heading';
import { Eyebrow } from '@/components/ui/Eyebrow';

export const metadata: Metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPage() {
  return (
    <>
      <main className="flex-1">
        <Section size="auto" pad="md" contain>
          <div className="max-w-3xl flex flex-col gap-3 mb-10">
            <Eyebrow>Legal</Eyebrow>
            <Heading variant="inner" as="h1">Privacy Policy</Heading>
          </div>
          <div className="prose prose-invert prose-sm max-w-3xl space-y-6 text-bone/60">
          <p><strong>Last updated:</strong> April 2026</p>
          <p>Stay Savage LTD (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to protecting your privacy. This policy explains how we collect, use, and protect your personal data in compliance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">1. Data Controller</h2>
          <p>Stay Savage LTD, Company Number 14703196, registered at 118 Plashet Road, Plaistow, London, E13 0QS. Contact: orders@stay-savage.com.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">2. Data We Collect</h2>
          <p>When you place an order, we collect: name, email address, phone number (optional), shipping address, and payment information. Payment card details are processed securely by Stripe and are never stored on our servers. When you browse the site, we may collect: IP address, browser type, pages visited, and cookies (with your consent).</p>

          <h2 className="text-xl font-bold text-foreground mt-8">3. How We Use Your Data</h2>
          <p>We use your data to: process and fulfil your orders, send order confirmation and shipping updates, respond to customer enquiries, improve our website and services, and send marketing communications (only with your explicit consent). Legal basis: contract performance (order fulfilment), legitimate interest (service improvement), and consent (marketing).</p>

          <h2 className="text-xl font-bold text-foreground mt-8">4. Third Parties</h2>
          <p>We share your data with the following trusted third parties, only as necessary to provide our services:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Stripe</strong> — payment processing</li>
            <li><strong>Royal Mail</strong> — order delivery and tracking</li>
            <li><strong>AWS (Amazon Web Services)</strong> — email delivery (SES)</li>
            <li><strong>Vercel</strong> — website hosting</li>
            <li><strong>Neon</strong> — database hosting (PostgreSQL)</li>
            <li><strong>Google Analytics</strong> — website analytics (with consent)</li>
            <li><strong>Meta (Facebook/Instagram)</strong> — advertising pixels (with consent)</li>
            <li><strong>TikTok</strong> — advertising pixels (with consent)</li>
          </ul>
          <p>We do not sell your personal data to any third party.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">5. Data Retention</h2>
          <p>Order data is retained for 6 years as required by UK tax regulations (HMRC). Marketing consent records are retained for as long as you remain subscribed. Website analytics data is retained for 26 months. You may request deletion of your data at any time (subject to legal retention requirements).</p>

          <h2 className="text-xl font-bold text-foreground mt-8">6. Your Rights</h2>
          <p>Under UK GDPR, you have the right to: access your personal data, rectify inaccurate data, erase your data (right to be forgotten), restrict processing, data portability, object to processing, and withdraw consent at any time. To exercise these rights, contact orders@stay-savage.com.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">7. Cookies</h2>
          <p>We use essential cookies for site functionality (cart, authentication) and analytics/marketing cookies (with your consent). You can manage cookie preferences at any time via the cookie consent banner. Essential cookies cannot be disabled as they are necessary for the site to function.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">8. Security</h2>
          <p>We implement appropriate technical and organisational measures to protect your data, including HTTPS encryption, secure payment processing via Stripe, and access controls on our database. No data transmission over the internet is 100% secure, but we take all reasonable steps to protect your information.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">9. Changes</h2>
          <p>We may update this policy from time to time. Changes will be posted on this page with an updated date.</p>

          <h2 className="text-xl font-bold text-foreground mt-8">10. Complaints</h2>
          <p>If you are unhappy with how we handle your data, you have the right to lodge a complaint with the Information Commissioner&apos;s Office (ICO) at ico.org.uk.</p>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
