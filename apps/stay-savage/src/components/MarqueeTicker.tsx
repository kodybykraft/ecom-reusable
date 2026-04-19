export function MarqueeTicker() {
  const items = [
    'STAY SAVAGE',
    'EST. UK',
    'FREE UK SHIPPING',
    'BUILT FOR THE STREETS',
    'DROP 01 — LIVE NOW',
  ];
  const loop = [...items, ...items, ...items, ...items];

  return (
    <div className="border-b border-border bg-ink overflow-hidden" aria-hidden="true">
      <div className="flex animate-[marquee_40s_linear_infinite] whitespace-nowrap py-2">
        {loop.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="font-display text-xs tracking-[0.3em] text-bone/70 px-6 flex items-center gap-6"
          >
            {item}
            <span className="text-savage">●</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[marquee_40s_linear_infinite\\] { animation: none; }
        }
      `}</style>
    </div>
  );
}
