import { Weight, Scissors, Snowflake } from 'lucide-react';

const features = [
  {
    icon: Weight,
    title: '280 GSM',
    body: 'Heavyweight brushed fleece. 80% combed ringspun cotton, 20% polyester. You feel the weight the moment it hits your hands.',
  },
  {
    icon: Scissors,
    title: 'DROP SHOULDER',
    body: 'Boxy oversized cut with tapered joggers. Ribbed cuffs that hold shape. Built for the layered fit.',
  },
  {
    icon: Snowflake,
    title: 'BRUSHED INNER',
    body: 'Soft-brushed fleece lining for the cold mornings and the colder commutes. Session after session.',
  },
];

export function Features() {
  return (
    <section className="bg-card border-y border-border">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-16 md:py-20 grid md:grid-cols-3 gap-10 md:gap-16">
        {features.map((f) => (
          <div key={f.title} className="flex flex-col gap-4">
            <f.icon className="size-7 text-savage" strokeWidth={1.5} />
            <h3 className="font-display text-3xl tracking-[0.05em] text-bone">{f.title}</h3>
            <p className="text-sm text-bone/60 leading-relaxed max-w-xs">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
