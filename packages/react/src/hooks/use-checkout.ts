import { useState, useCallback } from 'react';
import { useEcom } from '../context/ecom-context.js';

interface Checkout {
  id: string;
  cartId: string;
  email: string;
  shippingAddress: Record<string, unknown> | null;
  billingAddress: Record<string, unknown> | null;
  shippingMethodId: string | null;
  subtotal: number;
  shippingTotal: number;
  taxTotal: number;
  discountTotal: number;
  total: number;
  status: string;
}

export function useCheckout() {
  const { fetcher } = useEcom();
  const [checkout, setCheckout] = useState<Checkout | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = useCallback(
    async (cartId: string, email: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetcher<Checkout>('/checkout', {
          method: 'POST',
          body: JSON.stringify({ cartId, email }),
        });
        setCheckout(result);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to create checkout'));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetcher],
  );

  const updateShipping = useCallback(
    async (checkoutId: string, shippingAddress: Record<string, unknown>) => {
      setLoading(true);
      try {
        const result = await fetcher<Checkout>(`/checkout/${checkoutId}`, {
          method: 'PATCH',
          body: JSON.stringify({ shippingAddress }),
        });
        setCheckout(result);
        return result;
      } finally {
        setLoading(false);
      }
    },
    [fetcher],
  );

  const complete = useCallback(
    async (checkoutId: string) => {
      setLoading(true);
      try {
        const result = await fetcher<{ id: string; orderNumber: number }>(`/checkout/${checkoutId}/complete`, {
          method: 'POST',
        });
        return result;
      } finally {
        setLoading(false);
      }
    },
    [fetcher],
  );

  return { checkout, loading, error, create, updateShipping, complete };
}
