import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductPage from "./[id]/page";
import { CartProvider } from "@/components/CartContext";
import { PRODUCTS } from "@/lib/data";

// Parte numérica del importe (evita el espacio especial U+202F antes del €).
const money = (n: number) => `${n.toLocaleString("es-ES")},00`;

describe("Ficha de producto", () => {
  it("muestra el precio = precio_mercado + 20", async () => {
    const product = PRODUCTS[0];
    const ui = await ProductPage({ params: Promise.resolve({ id: product.id }) });
    render(<CartProvider>{ui}</CartProvider>);

    const salePrice = screen.getByTestId("sale-price");
    expect(salePrice).toHaveTextContent(money(product.precio_mercado + 20));

    // La fórmula del cálculo está visible
    expect(screen.getByTestId("price-formula")).toHaveTextContent(
      money(product.precio_mercado)
    );
  });

  it("muestra specs y vídeo", async () => {
    const product = PRODUCTS[2];
    const ui = await ProductPage({ params: Promise.resolve({ id: product.id }) });
    render(<CartProvider>{ui}</CartProvider>);

    expect(screen.getByTestId("product-video")).toBeInTheDocument();
    expect(screen.getByText(product.specs.sensor)).toBeInTheDocument();
  });
});
