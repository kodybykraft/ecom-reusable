import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { Section } from '@/components/ui/Section';
import { Heading } from '@/components/ui/Heading';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Stay Savage is not a brand. It is a standard. 280 GSM heavyweight tracksuits designed in the UK for those who earn it.',
};

export default function AboutPage() {
  return (
    <>
      <main className="flex-1">
        <Section size="auto" pad="lg" contain>
          <div className="max-w-3xl flex flex-col gap-4">
            <Eyebrow>The Standard</Eyebrow>
            <Heading variant="inner" as="h1">
              Stay Savage is not a brand.
              <br />
              It is a standard.
            </Heading>
          </div>
        </Section>

        <Section size="auto" pad="md" contain>
          <div className="max-w-3xl flex flex-col gap-6 text-bone/60 text-[17px] leading-relaxed">
            <p>
              Stay Savage was not built in a boardroom. It was built in the silence before the gym opens. In the discipline of showing up when nobody is watching. In the understanding that pressure is not something that happens to you — it is something you choose.
            </p>
            <p>
              Every piece we make is built to the same standard we hold ourselves to. 280 GSM heavyweight fleece because anything less does not last. Ringspun combed cotton because shortcuts show. Heat-pressed print because what you carry should be visible under pressure.
            </p>
            <p>
              This is not for everyone. It never was. Stay Savage is for the ones who understand that the work is the point. The ones who train when it is quiet. The ones who do not need to be seen to keep going.
            </p>
          </div>
        </Section>

        <Section size="auto" pad="md" bg="surface" contain>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: '280 GSM', body: 'Heavyweight fleece. Ringspun combed cotton. Built to endure everything you put yourself through.' },
              { title: 'Reflective', body: 'Born in the dark, seen by light. The reflective print is not decoration — it is a statement that carries under pressure.' },
              { title: 'The Pack', body: 'Loyalty, strength, and shared mentality. The Pack has standards. You are either part of it or you are not.' },
            ].map((v) => (
              <Card key={v.title} variant="lift" pad="lg">
                <Heading variant="m" as="h3" className="mb-3">
                  {v.title}
                </Heading>
                <p className="text-bone/60 leading-relaxed">{v.body}</p>
              </Card>
            ))}
          </div>
        </Section>

        <Section size="sm" pad="lg" contain>
          <div className="flex flex-col items-center text-center gap-4 max-w-3xl mx-auto">
            <Eyebrow>The Code</Eyebrow>
            <blockquote className="font-display text-[clamp(36px,6vw,72px)] uppercase leading-[0.95]">
              Pressure creates power.
            </blockquote>
            <p className="text-bone/60">Stay Savage LTD &mdash; London, UK</p>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
