import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { Section } from '@/components/ui/Section';
import { Heading } from '@/components/ui/Heading';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Stay Savage. Order enquiries, returns, and general questions.',
};

export default function ContactPage() {
  return (
    <>
      <main className="flex-1">
        <Section size="auto" pad="md" contain>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 lg:gap-16">
            <div className="flex flex-col gap-10 max-w-2xl">
              <div className="flex flex-col gap-3">
                <Eyebrow>Get in touch</Eyebrow>
                <Heading variant="inner" as="h1">
                  Say it straight.
                </Heading>
                <p className="text-bone/60">
                  Order enquiries, sizing questions, or anything else. We reply within 24 hours (usually faster).
                </p>
              </div>

              <div>
                <Heading variant="m" as="h2" className="mb-6">
                  Send a message
                </Heading>
                <ContactForm />
              </div>
            </div>

            <aside className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Eyebrow>Email</Eyebrow>
                <a
                  href="mailto:orders@stay-savage.com"
                  className="text-bone hover:text-[var(--color-savage-silver)] transition-colors"
                >
                  orders@stay-savage.com
                </a>
              </div>
              <div className="flex flex-col gap-2">
                <Eyebrow>Instagram</Eyebrow>
                <a
                  href="https://instagram.com/staysavageltd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bone hover:text-[var(--color-savage-silver)] transition-colors"
                >
                  @staysavageltd
                </a>
              </div>
              <div className="flex flex-col gap-2">
                <Eyebrow>TikTok</Eyebrow>
                <a
                  href="https://www.tiktok.com/@staysavage.ltd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bone hover:text-[var(--color-savage-silver)] transition-colors"
                >
                  @staysavage.ltd
                </a>
              </div>
              <div className="flex flex-col gap-2">
                <Eyebrow>Visit</Eyebrow>
                <address className="not-italic text-[14px] text-bone/60 leading-relaxed">
                  Stay Savage LTD
                  <br />
                  118 Plashet Road
                  <br />
                  Plaistow, London
                  <br />
                  E13 0QS
                </address>
              </div>
            </aside>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
