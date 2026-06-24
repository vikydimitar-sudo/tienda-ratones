import { describe, it, expect } from "vitest";
import {
  addItem,
  removeItem,
  setQuantity,
  cartTotal,
  cartCount,
} from "./cart";
import { PRODUCTS } from "./data";
import type { CartItem } from "./types";

const [a, b] = PRODUCTS;

describe("cart", () => {
  it("añade un producto nuevo", () => {
    const items = addItem([], a);
    expect(items).toHaveLength(1);
    expect(items[0].cantidad).toBe(1);
    expect(items[0].precio_venta).toBe(a.precio_venta);
  });

  it("incrementa la cantidad si ya existe", () => {
    let items: CartItem[] = [];
    items = addItem(items, a);
    items = addItem(items, a);
    expect(items).toHaveLength(1);
    expect(items[0].cantidad).toBe(2);
  });

  it("calcula el total correctamente al añadir", () => {
    let items: CartItem[] = [];
    items = addItem(items, a);
    items = addItem(items, b);
    items = addItem(items, a);
    // a x2 + b x1
    expect(cartTotal(items)).toBe(a.precio_venta * 2 + b.precio_venta);
    expect(cartCount(items)).toBe(3);
  });

  it("actualiza cantidad y elimina cuando llega a 0", () => {
    let items = addItem([], a);
    items = setQuantity(items, a.id, 5);
    expect(items[0].cantidad).toBe(5);
    expect(cartTotal(items)).toBe(a.precio_venta * 5);
    items = setQuantity(items, a.id, 0);
    expect(items).toHaveLength(0);
  });

  it("elimina un producto", () => {
    let items = addItem([], a);
    items = addItem(items, b);
    items = removeItem(items, a.id);
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe(b.id);
  });
});
