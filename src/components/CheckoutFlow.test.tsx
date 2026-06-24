import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartProvider } from "./CartContext";
import { Catalog } from "./Catalog";
import { CartView } from "./CartView";
import { Checkout } from "./Checkout";
import { Header } from "./Header";
import { CATEGORIES, PRODUCTS } from "@/lib/data";

// Parte numérica del importe (evita el espacio especial U+202F antes del €).
const money = (n: number) => `${n.toLocaleString("es-ES")},00`;

// Harness que combina catálogo + carrito + checkout bajo un mismo CartProvider,
// para ejercitar el flujo completo (añadir -> total -> confirmar pedido).
function Shop() {
  return (
    <CartProvider>
      <Header />
      <Catalog products={PRODUCTS} categories={CATEGORIES} />
      <CartView />
      <Checkout />
    </CartProvider>
  );
}

describe("Flujo carrito + checkout simulado", () => {
  it("añadir al carrito actualiza el total", async () => {
    const user = userEvent.setup();
    render(<Shop />);

    const a = PRODUCTS[0];
    const b = PRODUCTS[1];

    await user.click(screen.getByTestId(`add-${a.id}`));
    await user.click(screen.getByTestId(`add-${b.id}`));

    expect(screen.getByTestId("cart-count")).toHaveTextContent("2");
    expect(screen.getByTestId("cart-total")).toHaveTextContent(
      money(a.precio_venta + b.precio_venta)
    );
  });

  it("incrementar cantidad recalcula el total", async () => {
    const user = userEvent.setup();
    render(<Shop />);
    const a = PRODUCTS[0];

    await user.click(screen.getByTestId(`add-${a.id}`));
    await user.click(screen.getByTestId(`inc-${a.id}`));

    expect(screen.getByTestId(`qty-${a.id}`)).toHaveTextContent("2");
    expect(screen.getByTestId("cart-total")).toHaveTextContent(
      money(a.precio_venta * 2)
    );
  });

  it("completa un pedido simulado y muestra el resumen", async () => {
    const user = userEvent.setup();
    render(<Shop />);

    const a = PRODUCTS[0];
    const b = PRODUCTS[1];
    await user.click(screen.getByTestId(`add-${a.id}`));
    await user.click(screen.getByTestId(`add-${b.id}`));

    const total = a.precio_venta + b.precio_venta;

    await user.type(screen.getByTestId("input-nombre"), "Ada Lovelace");
    await user.type(screen.getByTestId("input-email"), "ada@example.com");
    await user.type(screen.getByTestId("input-direccion"), "Calle Mayor 1");

    await user.click(screen.getByTestId("confirm-order"));

    // Confirmación visible con resumen y total
    expect(screen.getByTestId("order-confirmation")).toBeInTheDocument();
    expect(screen.getByTestId("order-id")).toHaveTextContent(/RS-/);
    expect(screen.getByTestId("order-total")).toHaveTextContent(money(total));
    expect(screen.getByTestId("order-items").children.length).toBe(2);

    // El carrito queda vacío tras confirmar
    expect(screen.getByTestId("cart-count")).toHaveTextContent("0");
  });
});
