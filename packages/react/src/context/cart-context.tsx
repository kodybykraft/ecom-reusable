import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useEcom } from './ecom-context.js';

interface CartItem {
  id: string;
  variantId: string;
  quantity: number;
  variant: {
    id: string;
    title: string;
    price: number;
    productId: string;
    product?: { title: string; slug: string };
  };
}

interface Cart {
  id: string;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
}

interface CartContextValue {
  cart: Cart | null;
  loading: boolean;
  error: Error | null;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

function computeCart(raw: { id: string; items: CartItem[] }): Cart {
  const itemCount = raw.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = raw.items.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);
  return { ...raw, itemCount, subtotal };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { fetcher } = useEcom();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getCartId = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('ecom_cart_id');
  };

  const saveCartId = (id: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ecom_cart_id', id);
    }
  };

  const refresh = useCallback(async () => {
    const cartId = getCartId();
    if (!cartId) return;
    try {
      setLoading(true);
      const data = await fetcher<{ id: string; items: CartItem[] }>(`/cart/${cartId}`);
      setCart(computeCart(data));
    } catch {
      // Cart may have expired
      localStorage.removeItem('ecom_cart_id');
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = useCallback(
    async (variantId: string, quantity = 1) => {
      setError(null);
      setLoading(true);
      try {
        let cartId = getCartId();
        if (!cartId) {
          const newCart = await fetcher<{ id: string; items: CartItem[] }>('/cart', {
            method: 'POST',
          });
          cartId = newCart.id;
          saveCartId(cartId);
        }
        const data = await fetcher<{ id: string; items: CartItem[] }>(`/cart/${cartId}/items`, {
          method: 'POST',
          body: JSON.stringify({ variantId, quantity }),
        });
        setCart(computeCart(data));
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    },
    [fetcher],
  );

  const updateItem = useCallback(
    async (itemId: string, quantity: number) => {
      setError(null);
      const cartId = getCartId();
      if (!cartId) return;
      setLoading(true);
      try {
        const data = await fetcher<{ id: string; items: CartItem[] }>(
          `/cart/${cartId}/items/${itemId}`,
          { method: 'PATCH', body: JSON.stringify({ quantity }) },
        );
        setCart(computeCart(data));
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    },
    [fetcher],
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      setError(null);
      const cartId = getCartId();
      if (!cartId) return;
      setLoading(true);
      try {
        const data = await fetcher<{ id: string; items: CartItem[] }>(
          `/cart/${cartId}/items/${itemId}`,
          { method: 'DELETE' },
        );
        setCart(computeCart(data));
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    },
    [fetcher],
  );

  return (
    <CartContext.Provider value={{ cart, loading, error, addItem, updateItem, removeItem, refresh }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
