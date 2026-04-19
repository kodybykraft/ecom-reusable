import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { Section } from '@/components/ui/Section';
import { Heading } from '@/components/ui/Heading';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ShopClient } from './ShopClient';
import { ecom } from '@/lib/ecom';

export const metadata: Metadata = {
  title: 'Shop',
  description:
    'The Stay Savage collection. 280 GSM heavyweight fleece tracksuits in four colourways plus the Reflective drop. UK designed. Free UK shipping.',
};

export default async function ShopPage() {
  const result = await ecom.products.list(
    { status: 'active' },
    { pageSize: 20 },
    { field: 'title', direction: 'asc' },
  );

  return (
    <>

      <main className="flex-1">
        <Section size="auto" pad="md" bg="surface" contain>
          <div className="flex flex-col items-start gap-4 max-w-3xl">
            <Eyebrow>The Collection</Eyebrow>
            <Heading variant="inner" as="h1">
              Shop the drop
            </Heading>
            <p className="text-bone/60 text-[17px] leading-relaxed max-w-xl">
              Two series. One standard. 280 GSM heavyweight fleece tracksuits in four colourways plus the Reflective drop for the ones who train before the sun.
            </p>
          </div>
        </Section>

        <Section size="auto" pad="md" contain>
          <ShopClient products={result.data as never} total={result.total} />
        </Section>
      </main>

      <Footer />
    </>
  );
}
