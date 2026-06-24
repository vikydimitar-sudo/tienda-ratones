// @vitest-environment node
import { describe, it, expect } from "vitest";
import { readFileSync, existsSync, statSync } from "node:fs";
import path from "node:path";
import { PRODUCTS, CATEGORIES } from "./data";
import { IMAGE_MANIFEST } from "./imageManifest";
import { CARRIERS } from "./shipping";

const PUBLIC = path.resolve(process.cwd(), "public");
const IMG_BUDGET_KB = 120; // presupuesto por imagen

describe("Calidad · integridad de datos", () => {
  it("hay ≥ 6 productos con id único", () => {
    expect(PRODUCTS.length).toBeGreaterThanOrEqual(6);
    const ids = PRODUCTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("precio_venta = precio_mercado + 20 en todos", () => {
    for (const p of PRODUCTS) expect(p.precio_venta).toBe(p.precio_mercado + 20);
  });

  it("todos los campos obligatorios están presentes y son sensatos", () => {
    for (const p of PRODUCTS) {
      expect(p.nombre.trim()).toBeTruthy();
      expect(p.marca.trim()).toBeTruthy();
      expect(CATEGORIES).toContain(p.categoria);
      expect(p.descripcion.length).toBeGreaterThan(20);
      expect(p.specs.dpi).toBeGreaterThan(0);
      expect(p.specs.peso_g).toBeGreaterThan(0);
      expect(p.specs.botones).toBeGreaterThan(0);
      expect(p.specs.polling_hz).toBeGreaterThan(0);
      expect(p.imagenes.length).toBeGreaterThan(0);
    }
  });
});

describe("Calidad · coherencia datos ↔ imágenes (el bug del cable)", () => {
  it("cada producto está verificado a ojo en el manifiesto", () => {
    for (const p of PRODUCTS) {
      const check = IMAGE_MANIFEST[p.id];
      expect(check, `Falta verificación visual de ${p.id}`).toBeDefined();
      expect(check.verified, `${p.id} sin verificar`).toBe(true);
    }
  });

  it("un producto INALÁMBRICO no puede mostrar un cable en su foto", () => {
    for (const p of PRODUCTS) {
      const esInalambrico = p.specs.conexion !== "Cable";
      if (esInalambrico) {
        expect(
          IMAGE_MANIFEST[p.id].muestraCable,
          `${p.id} (${p.specs.conexion}) muestra un cable en la foto`
        ).toBe(false);
      }
    }
  });

  it("la categoría 'Inalámbrico' implica conexión sin cable", () => {
    for (const p of PRODUCTS) {
      if (p.categoria === "Inalámbrico") {
        expect(p.specs.conexion).not.toBe("Cable");
      }
    }
  });
});

describe("Calidad · imágenes optimizadas", () => {
  it("todas las imágenes existen, son .webp y están dentro de presupuesto", () => {
    for (const p of PRODUCTS) {
      for (const img of p.imagenes) {
        expect(img.startsWith("/products/")).toBe(true);
        expect(img.endsWith(".webp"), `${img} debería ser .webp`).toBe(true);
        const file = path.join(PUBLIC, img);
        expect(existsSync(file), `Falta el archivo ${img}`).toBe(true);
        const kb = statSync(file).size / 1024;
        expect(kb, `${img} pesa ${kb.toFixed(0)}KB (>${IMG_BUDGET_KB}KB)`).toBeLessThanOrEqual(
          IMG_BUDGET_KB
        );
      }
    }
  });
});

describe("Calidad · envíos", () => {
  it("hay transportistas y al menos uno gratis", () => {
    expect(CARRIERS.length).toBeGreaterThan(0);
    expect(CARRIERS.some((c) => c.precio === 0)).toBe(true);
    for (const c of CARRIERS) {
      expect(c.etaHoras).toBeGreaterThan(0);
      expect(c.nombre.trim()).toBeTruthy();
    }
  });
});

describe("Calidad · enlaces internos del header/footer existen como rutas", () => {
  it("las rutas referenciadas tienen su page en src/app", () => {
    const rutas = [
      "comparar",
      "carrito",
      "checkout",
      "login",
      "registro",
      "cuenta",
      "favoritos",
      "pedidos",
      "bandeja",
      "buscar",
    ];
    for (const r of rutas) {
      const p = path.resolve(process.cwd(), "src", "app", r, "page.tsx");
      expect(existsSync(p), `Falta la página /${r}`).toBe(true);
    }
  });
});
