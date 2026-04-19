import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Journal',
  description: 'Stories, drops, and the uncomfortable truths behind Stay Savage.',
};

export default function JournalPage() {
  return (
    <>
      <main className="flex-1">
        <section className="mx-auto max-w-[1600px] px-6 md:px-12 py-20 md:py-28">
          <p className="font-display text-xs tracking-[0.4em] text-savage mb-3">THE JOURNAL</p>
          <h1 className="font-display text-5xl md:text-7xl tracking-tight text-bone leading-none mb-8">
            COMING SOON.
          </h1>
          <p className="text-bone/60 text-base max-w-md leading-relaxed">
            Drop stories, behind-the-scenes, and the mentality that built Stay Savage.
            First issue drops with the next collection.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
