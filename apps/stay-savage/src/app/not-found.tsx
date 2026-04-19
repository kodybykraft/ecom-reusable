import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';

export default function NotFound() {
  return (
    <>
      <main className="flex-1 flex items-center justify-center px-6 py-32">
        <div className="text-center max-w-lg">
          <p className="font-display text-[120px] md:text-[180px] leading-none text-bone/10 select-none">
            404
          </p>
          <h1 className="font-display text-4xl md:text-5xl tracking-tight text-bone -mt-8 md:-mt-12 relative z-10">
            WRONG TURN.
          </h1>
          <p className="text-bone/60 mt-4 mb-8">
            This page does not exist. The collection does.
          </p>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 bg-bone text-ink font-display tracking-[0.2em] text-sm px-7 py-4 hover:bg-savage hover:text-bone transition-colors"
          >
            BACK TO THE DROP
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
