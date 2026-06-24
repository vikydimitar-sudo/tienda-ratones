import { describe, it, expect } from "vitest";
import { crearPedido, computarTracking, TRACKING_STAGES } from "./orders";
import { reconciliarCorreos } from "./mail";
import type { CartItem, User } from "./types";

const user: User = {
  id: "usr_1",
  nombre: "Ada",
  email: "ada@example.com",
  passwordHash: "x",
  provider: "password",
  createdAt: 0,
};

const items: CartItem[] = [
  { id: "viper", nombre: "Viper", precio_venta: 159, cantidad: 2 },
  { id: "mx", nombre: "MX", precio_venta: 139, cantidad: 1 },
];

const direccion = {
  nombre: "Ada",
  calle: "Calle Mayor 1",
  ciudad: "Madrid",
  cp: "28001",
  pais: "España",
};

describe("orders", () => {
  it("crea un pedido con totales correctos", () => {
    const order = crearPedido({
      user,
      items,
      direccion,
      carrierId: "rapidex",
      cardLast4: "4242",
    });
    expect(order.subtotal).toBe(159 * 2 + 139);
    expect(order.envio).toBe(4.99);
    expect(order.total).toBe(159 * 2 + 139 + 4.99);
    expect(order.numero).toMatch(/^RS-\d{6}$/);
    expect(order.tracking).toMatch(/^TRK\d{8}ES$/);
    expect(order.etaHoras).toBe(24);
  });

  it("rechaza carrito vacío o transportista inválido", () => {
    expect(() =>
      crearPedido({ user, items: [], direccion, carrierId: "rapidex", cardLast4: "x" })
    ).toThrow();
    expect(() =>
      crearPedido({ user, items, direccion, carrierId: "noexiste", cardLast4: "x" })
    ).toThrow();
  });

  it("el tracking avanza con el tiempo", () => {
    const order = crearPedido({
      user,
      items,
      direccion,
      carrierId: "rapidex",
      cardLast4: "4242",
    });
    const t0 = computarTracking(order, order.createdAt);
    expect(t0.currentIndex).toBe(0);
    expect(t0.entregado).toBe(false);

    const last = TRACKING_STAGES[TRACKING_STAGES.length - 1];
    const tEnd = computarTracking(order, order.createdAt + (last.offsetSec + 1) * 1000);
    expect(tEnd.entregado).toBe(true);
    expect(tEnd.currentIndex).toBe(TRACKING_STAGES.length - 1);
  });
});

describe("mail reconcile", () => {
  it("genera confirmación al instante y envío/entrega según el tiempo", () => {
    const order = crearPedido({
      user,
      items,
      direccion,
      carrierId: "rapidex",
      cardLast4: "4242",
    });

    const m0 = reconciliarCorreos([order], [], order.createdAt);
    expect(m0.filter((m) => m.kind === "pedido")).toHaveLength(1);
    expect(m0.some((m) => m.kind === "envio")).toBe(false);

    const m1 = reconciliarCorreos([order], m0, order.createdAt + 300_000);
    expect(m1.some((m) => m.kind === "envio")).toBe(true);
    expect(m1.some((m) => m.kind === "entrega")).toBe(true);

    // No duplica al reconciliar de nuevo
    const m2 = reconciliarCorreos([order], m1, order.createdAt + 300_000);
    expect(m2).toHaveLength(m1.length);
  });
});
