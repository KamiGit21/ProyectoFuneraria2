import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Servicio } from '../api/services';

export interface CartLine { servicio: Servicio; cantidad: number; }

interface CartCtx {
  items      : CartLine[];
  addItem    : (s: Servicio) => void;
  removeItem : (id: string | number) => void;
  clear      : () => void;
  total      : () => number;
}

const CartContext = createContext<CartCtx | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  /* ---------- carga inicial ---------- */
  const [items, setItems] = useState<CartLine[]>(() => {
    try {
      const raw = localStorage.getItem('cart');
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });

  /* ---------- persistencia ---------- */
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  /* ---------- helpers ---------- */
  const addItem = (s: Servicio) =>
    setItems(prev => {
      const idStr = String(s.id);
      const idx   = prev.findIndex(l => String(l.servicio.id) === idStr);

      if (idx >= 0) {
        /* mismo servicio ⇒ solo aumentamos cantidad */
        const clone = [...prev];
        clone[idx]  = { ...clone[idx], cantidad: clone[idx].cantidad + 1 };
        return clone;
      }
      /* nuevo servicio */
      return [...prev, { servicio: s, cantidad: 1 }];
    });

  const removeItem = (id: string | number) =>
    setItems(prev => prev.filter(l => String(l.servicio.id) !== String(id)));

  const clear = () => setItems([]);

  const total = () =>
    items.reduce((acc, l) => {
      const price = Number(l.servicio.precio_base) || 0;
      return acc + price * l.cantidad;
    }, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, clear, total }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
<<<<<<< HEAD
};
=======
};
>>>>>>> main
