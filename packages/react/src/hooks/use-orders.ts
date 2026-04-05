import { useState, useEffect, useCallback } from 'react';
import { useEcom } from '../context/ecom-context.js';

interface Order {
  id: string;
  orderNumber: number;
  email: string;
  total: number;
  financialStatus: string;
  fulfillmentStatus: string;
  createdAt: string;
  lineItems: Array<{
    id: string;
    title: string;
    variantTitle: string;
    quantity: number;
    price: number;
  }>;
}

export function useOrders() {
  const { fetcher } = useEcom();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher<{ data: Order[] }>('/orders');
      setOrders(result.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch orders'));
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
}
