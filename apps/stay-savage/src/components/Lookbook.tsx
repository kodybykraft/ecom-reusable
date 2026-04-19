import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export function Lookbook() {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="flex items-end justify-between mb-10 md:mb-14">
          <div>
            <p className="font-display text-xs tracking-[0.4em] text-savage mb-3">SS / 01</p>
            <h2 className="font-display text-5xl md:text-7xl tracking-tight text-bone leading-none">
              THE LOOKBOOK.
            </h2>
          </div>
          <Link
            href="/about"
            className="hidden md:inline-flex items-center gap-2 font-display text-sm tracking-[0.2em] text-bone/70 hover:text-bone transition-colors"
          >
            FULL EDITORIAL <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-5">
          <div className="md:col-span-5 md:row-span-2 relative overflow-hidden bg-card aspect-[3/4] md:aspect-auto group">
            <Image
              src="/images/lifestyle/editorial-portrait-v2.jpg"
              alt="Editorial — Stay Savage SS01"
              fill
              sizes="(max-width: 768px) 100vw, 42vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute bottom-5 left-5 font-display text-xs tracking-[0.3em] text-bone bg-ink/60 backdrop-blur-sm px-3 py-2">
              01 — THE EDITORIAL
            </div>
          </div>

          <div className="md:col-span-7 relative overflow-hidden bg-card aspect-[16/9] group">
            <Image
              src="/images/lifestyle/action-v2.jpg"
              alt="Movement — Stay Savage in motion"
              fill
              sizes="(max-width: 768px) 100vw, 58vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute bottom-5 left-5 font-display text-xs tracking-[0.3em] text-bone bg-ink/60 backdrop-blur-sm px-3 py-2">
              02 — IN MOTION
            </div>
          </div>

          <div className="md:col-span-7 relative overflow-hidden bg-card aspect-[16/9] group">
            <Image
              src="/images/lifestyle/pack-duo-v2.jpg"
              alt="The Pack — Stay Savage duo"
              fill
              sizes="(max-width: 768px) 100vw, 58vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute bottom-5 left-5 font-display text-xs tracking-[0.3em] text-bone bg-ink/60 backdrop-blur-sm px-3 py-2">
              03 — THE PACK
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
