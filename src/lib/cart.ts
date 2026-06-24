import type { CartItem, MouseProduct } from "./types";

/** Funciones puras del carrito: fáciles de testear y sin estado de React. */

export function addItem(items: CartItem[], product: MouseProduct, cantidad = 1): CartItem[] {
  const existing = items.find((i) => i.id === product.id);
  if (existing) {
    return items.map((i) =>
      i.id === product.id ? { ...i, cantidad: i.cantidad + cantidad } : i
    );
  }
  return [
    ...items,
    {
      id: product.id,
      nombre: product.nombre,
      precio_venta: product.precio_venta,
      cantidad,
    },
  ];
}

export function removeItem(items: CartItem[], id: string): CartItem[] {
  return items.filter((i) => i.id !== id);
}

export function setQuantity(items: CartItem[], id: string, cantidad: number): CartItem[] {
  if (cantidad <= 0) return removeItem(items, id);
  return items.map((i) => (i.id === id ? { ...i, cantidad } : i));
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.precio_venta * i.cantidad, 0);
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.cantidad, 0);
}
