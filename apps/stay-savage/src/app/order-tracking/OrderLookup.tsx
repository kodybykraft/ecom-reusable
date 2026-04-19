'use client';

import { useState } from 'react';
import { toast } from 'sonner';

interface OrderResult {
  orderNumber: number;
  email: string;
  total: number;
  financialStatus: string;
  fulfillmentStatus: string;
  createdAt: string;
  lineItems: { title: string; variantTitle: string; quantity: number; price: number }[];
}

export function OrderLookup() {
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OrderResult | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !orderNumber) {
      toast.error('Enter both email and order number');
      return;
    }

    setLoading(true);
    setNotFound(false);
    setResult(null);

    try {
      const res = await fetch(`/api/ecom/orders/lookup?email=${encodeURIComponent(email)}&orderNumber=${orderNumber}`);
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        setNotFound(true);
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full p-3 bg-card border border-border text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none transition-colors';

  const statusLabel = (status: string) => {
    const map: Record<string, string> = {
      pending: 'Payment Pending',
      paid: 'Paid',
      refunded: 'Refunded',
      unfulfilled: 'Processing',
      partial: 'Partially Shipped',
      fulfilled: 'Shipped',
    };
    return map[status] || status;
  };

  return (
    <div>
      <form onSubmit={handleLookup} className="space-y-4 mb-8">
        <div>
          <label className="text-sm font-bold block mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="The email you ordered with"
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className="text-sm font-bold block mb-1.5">Order Number</label>
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="e.g. 1001"
            className={inputClass}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-foreground text-background font-bold text-sm tracking-[0.15em] uppercase hover:opacity-90 press-active transition-all disabled:opacity-50"
        >
          {loading ? 'Looking up...' : 'Track Order'}
        </button>
      </form>

      {notFound && (
        <div className="border border-border p-6 text-center">
          <p className="font-bold mb-2">Order not found.</p>
          <p className="text-muted-foreground text-sm">
            Check your email and order number, or contact orders@stay-savage.com.
          </p>
        </div>
      )}

      {result && (
        <div className="border border-border divide-y divide-border">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Order</p>
                <p className="text-2xl font-bold">#{result.orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{statusLabel(result.fulfillmentStatus)}</p>
                <p className="text-xs text-muted-foreground">{statusLabel(result.financialStatus)}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Placed {new Date(result.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="p-6 space-y-3">
            {result.lineItems.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{item.title} — {item.variantTitle} x{item.quantity}</span>
                <span className="font-bold">£{((item.price * item.quantity) / 100).toFixed(0)}</span>
              </div>
            ))}
          </div>

          <div className="p-6 flex justify-between">
            <span className="font-bold">Total</span>
            <span className="font-bold text-lg">£{(result.total / 100).toFixed(0)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
