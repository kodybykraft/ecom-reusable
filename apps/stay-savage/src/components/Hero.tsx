import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative w-full h-[85vh] min-h-[600px] overflow-hidden bg-ink">
      <Image
        src="/images/lifestyle/hero-landscape.jpg"
        alt="Stay Savage — Drop 01"
        fill
        priority
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />

      <div className="relative z-10 h-full mx-auto max-w-[1600px] px-6 md:px-12 flex items-end md:items-center pb-20 md:pb-0">
        <div className="max-w-xl">
          <p className="font-display text-xs tracking-[0.4em] text-savage mb-4">
            DROP 01 — LIVE NOW
          </p>
          <h1 className="font-display text-6xl md:text-8xl leading-[0.9] text-bone tracking-tight">
            BUILT FOR
            <br />
            THE <span className="text-savage">STREETS.</span>
          </h1>
          <p className="mt-6 text-bone/70 text-base md:text-lg max-w-md leading-relaxed">
            Heavyweight UK streetwear. 280 GSM brushed fleece. No filler. No noise. Just the cut,
            the weight, and the attitude.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 bg-bone text-ink font-display tracking-[0.2em] text-sm px-7 py-4 hover:bg-savage hover:text-bone transition-colors"
            >
              SHOP THE DROP
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 border border-bone/40 text-bone font-display tracking-[0.2em] text-sm px-7 py-4 hover:border-bone hover:bg-bone/5 transition-colors"
            >
              THE MENTALITY
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-bone/10 bg-ink/40 backdrop-blur-sm">
        <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-4 flex items-center justify-between text-xs font-display tracking-[0.3em] text-bone/60">
          <span>EST. UK</span>
          <span className="hidden md:inline">HEAVYWEIGHT — 280 GSM</span>
          <span>SS / 01</span>
        </div>
      </div>
    </section>
  );
}
