import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Catalog } from "./Catalog";
import { CartProvider } from "./CartContext";
import { CATEGORIES, PRODUCTS } from "@/lib/data";

function renderCatalog() {
  return render(
    <CartProvider>
      <Catalog products={PRODUCTS} categories={CATEGORIES} />
    </CartProvider>
  );
}

describe("Catalog (home)", () => {
  it("lista al menos 6 productos", () => {
    renderCatalog();
    const grid = screen.getByTestId("product-grid");
    expect(grid.children.length).toBeGreaterThanOrEqual(6);
    expect(grid.children.length).toBe(PRODUCTS.length);
  });

  it("filtra por categoría", async () => {
    const user = userEvent.setup();
    renderCatalog();

    const gamingCount = PRODUCTS.filter((p) => p.categoria === "Gaming").length;
    await user.click(screen.getByTestId("filter-Gaming"));

    const grid = screen.getByTestId("product-grid");
    expect(grid.children.length).toBe(gamingCount);
    expect(screen.getByTestId("result-count")).toHaveTextContent(
      String(gamingCount)
    );

    // Solo productos Gaming visibles
    for (const p of PRODUCTS.filter((p) => p.categoria === "Gaming")) {
      expect(within(grid).getByTestId(`product-${p.id}`)).toBeInTheDocument();
    }
    for (const p of PRODUCTS.filter((p) => p.categoria !== "Gaming")) {
      expect(within(grid).queryByTestId(`product-${p.id}`)).toBeNull();
    }
  });

  it("vuelve a mostrar todos al pulsar Todos", async () => {
    const user = userEvent.setup();
    renderCatalog();
    await user.click(screen.getByTestId("filter-Oficina"));
    await user.click(screen.getByTestId("filter-Todos"));
    expect(screen.getByTestId("product-grid").children.length).toBe(
      PRODUCTS.length
    );
  });

  it("muestra el precio de venta (mercado + 20) en cada tarjeta", () => {
    renderCatalog();
    for (const p of PRODUCTS) {
      const price = screen.getByTestId(`price-${p.id}`);
      // El número del precio de venta aparece en la tarjeta
      expect(price.textContent).toContain(String(p.precio_mercado + 20));
    }
  });
});
