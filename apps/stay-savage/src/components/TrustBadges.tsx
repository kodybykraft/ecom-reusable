import { Truck, RotateCcw, Shield } from 'lucide-react';

export function TrustBadges({ compact = false }: { compact?: boolean }) {
  const badges = [
    { icon: Truck, label: 'Free UK Shipping', sub: '3-5 business days' },
    { icon: RotateCcw, label: '30-Day Returns', sub: 'Exchanges + refunds' },
    { icon: Shield, label: 'Secure Checkout', sub: 'Stripe-powered' },
  ];

  if (compact) {
    return (
      <div className="flex justify-center gap-6 text-xs text-muted-foreground">
        {badges.map((b) => (
          <div key={b.label} className="flex items-center gap-1.5">
            <b.icon className="h-3.5 w-3.5" />
            <span>{b.label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {badges.map((b) => (
        <div
          key={b.label}
          className="glass  p-4 text-center"
        >
          <b.icon className="h-5 w-5 mx-auto mb-2 text-accent" />
          <p className="font-bold text-sm">{b.label}</p>
          <p className="text-muted-foreground text-xs mt-1">{b.sub}</p>
        </div>
      ))}
    </div>
  );
}
