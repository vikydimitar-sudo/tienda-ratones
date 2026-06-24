"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { CartItem, MouseProduct } from "@/lib/types";
import {
  addItem,
  cartCount,
  cartTotal,
  removeItem,
  setQuantity,
} from "@/lib/cart";

const STORAGE_KEY = "tienda-ratones-cart";

type Action =
  | { type: "add"; product: MouseProduct; cantidad?: number }
  | { type: "remove"; id: string }
  | { type: "setQty"; id: string; cantidad: number }
  | { type: "clear" }
  | { type: "hydrate"; items: CartItem[] };

function reducer(state: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case "add":
      return addItem(state, action.product, action.cantidad ?? 1);
    case "remove":
      return removeItem(state, action.id);
    case "setQty":
      return setQuantity(state, action.id, action.cantidad);
    case "clear":
      return [];
    case "hydrate":
      return action.items;
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  total: number;
  count: number;
  add: (product: MouseProduct, cantidad?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, cantidad: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(reducer, []);

  // Hidratar desde localStorage en el cliente.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", items: JSON.parse(raw) as CartItem[] });
    } catch {
      // ignore corrupt storage
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore quota errors
    }
  }, [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      total: cartTotal(items),
      count: cartCount(items),
      add: (product, cantidad) => dispatch({ type: "add", product, cantidad }),
      remove: (id) => dispatch({ type: "remove", id }),
      setQty: (id, cantidad) => dispatch({ type: "setQty", id, cantidad }),
      clear: () => dispatch({ type: "clear" }),
    }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
