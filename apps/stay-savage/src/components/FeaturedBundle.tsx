import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function FeaturedBundle() {
  return (
    <section className="bg-card border-y border-border">
      <div className="mx-auto max-w-[1600px] grid md:grid-cols-2">
        <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[600px] overflow-hidden">
          <Image
            src="/images/lifestyle/pack-duo-v2.jpg"
            alt="The Pack — Stay Savage two-piece bundle"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute top-5 left-5 font-display text-xs tracking-[0.3em] bg-savage text-bone px-3 py-2">
            SAVE £30
          </div>
        </div>
        <div className="flex flex-col justify-center px-6 md:px-16 py-14 md:py-0">
          <p className="font-display text-xs tracking-[0.4em] text-savage mb-4">THE PACK</p>
          <h2 className="font-display text-5xl md:text-7xl tracking-tight text-bone leading-none">
            TWO SETS.
            <br />
            ONE PRICE.
          </h2>
          <p className="mt-6 text-bone/70 text-base max-w-md leading-relaxed">
            Pick any two tracksuit sets and save £30. Stack the colours, build the rotation,
            stay savage through every season.
          </p>
          <div className="mt-8 flex items-baseline gap-4">
            <p className="font-display text-4xl text-bone">£170</p>
            <p className="font-display text-xl text-bone/40 line-through">£200</p>
          </div>
          <div className="mt-8">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 bg-bone text-ink font-display tracking-[0.2em] text-sm px-7 py-4 hover:bg-savage hover:text-bone transition-colors"
            >
              BUILD THE PACK
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
