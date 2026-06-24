import { describe, it, expect } from "vitest";
import { calcularPrecioVenta, MARGEN_VENTA, formatEUR } from "./pricing";
import { PRODUCTS } from "./data";

describe("pricing", () => {
  it("calcula precio_venta = precio_mercado + 20", () => {
    expect(calcularPrecioVenta(100)).toBe(120);
    expect(calcularPrecioVenta(0)).toBe(MARGEN_VENTA);
    expect(MARGEN_VENTA).toBe(20);
  });

  it("formatea importes en euros", () => {
    expect(formatEUR(120)).toContain("120");
    expect(formatEUR(120)).toContain("€");
  });
});

describe("catálogo", () => {
  it("tiene al menos 6 productos", () => {
    expect(PRODUCTS.length).toBeGreaterThanOrEqual(6);
  });

  it("todos los productos respetan precio_venta = precio_mercado + 20", () => {
    for (const p of PRODUCTS) {
      expect(p.precio_venta).toBe(p.precio_mercado + 20);
    }
  });

  it("cada producto tiene los campos requeridos", () => {
    for (const p of PRODUCTS) {
      expect(p.id).toBeTruthy();
      expect(p.nombre).toBeTruthy();
      expect(p.marca).toBeTruthy();
      expect(p.categoria).toBeTruthy();
      expect(p.specs.dpi).toBeGreaterThan(0);
      expect(p.specs.sensor).toBeTruthy();
      expect(p.specs.peso_g).toBeGreaterThan(0);
      expect(p.specs.botones).toBeGreaterThan(0);
      expect(p.specs.conexion).toBeTruthy();
      expect(p.specs.polling_hz).toBeGreaterThan(0);
      expect(p.imagenes.length).toBeGreaterThan(0);
      expect(p.descripcion).toBeTruthy();
    }
  });
});
