'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { EcomProvider, CartProvider } from '@ecom/react';

type UIState = {
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
};

const UICtx = createContext<UIState | null>(null);

export function useUI() {
  const ctx = useContext(UICtx);
  if (!ctx) throw new Error('useUI must be used within Providers');
  return ctx;
}

export function Providers({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <EcomProvider apiBase="/api/ecom">
      <CartProvider>
        <UICtx.Provider value={{ cartOpen, setCartOpen, menuOpen, setMenuOpen }}>
          {children}
        </UICtx.Provider>
      </CartProvider>
    </EcomProvider>
  );
}
