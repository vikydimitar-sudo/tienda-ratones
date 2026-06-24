import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Compare } from "./Compare";
import { PRODUCTS } from "@/lib/data";

describe("Compare (comparador)", () => {
  it("enfrenta al menos 2 productos con specs lado a lado", () => {
    render(<Compare products={PRODUCTS} />);
    const table = screen.getByTestId("compare-table");
    expect(table).toBeInTheDocument();

    const [a, b] = PRODUCTS;
    // Specs lado a lado: DPI de ambos productos presentes
    expect(
      screen.getByTestId(`compare-DPI-${a.id}`)
    ).toHaveTextContent(a.specs.dpi.toLocaleString("es-ES"));
    expect(
      screen.getByTestId(`compare-DPI-${b.id}`)
    ).toHaveTextContent(b.specs.dpi.toLocaleString("es-ES"));
  });

  it("muestra el precio de venta de cada producto comparado", () => {
    render(<Compare products={PRODUCTS} />);
    const [a] = PRODUCTS;
    expect(
      screen.getByTestId(`compare-Precio venta-${a.id}`)
    ).toHaveTextContent(String(a.precio_mercado + 20));
  });

  it("pide 2 productos si se deselecciona hasta dejar menos de 2", async () => {
    const user = userEvent.setup();
    render(<Compare products={PRODUCTS} />);
    const [a, b] = PRODUCTS;
    await user.click(screen.getByTestId(`compare-toggle-${a.id}`));
    await user.click(screen.getByTestId(`compare-toggle-${b.id}`));
    expect(screen.getByTestId("compare-hint")).toBeInTheDocument();
  });

  it("permite comparar más de 2 productos", async () => {
    const user = userEvent.setup();
    render(<Compare products={PRODUCTS} />);
    const c = PRODUCTS[2];
    await user.click(screen.getByTestId(`compare-toggle-${c.id}`));
    expect(screen.getByTestId(`compare-DPI-${c.id}`)).toBeInTheDocument();
  });
});
