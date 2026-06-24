import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Providers } from "./Providers";
import { useStore } from "./store";
import { Catalog } from "./Catalog";
import { CartView } from "./CartView";
import { Checkout } from "./Checkout";
import { CATEGORIES, PRODUCTS } from "@/lib/data";

const money = (n: number) =>
  n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Disparador de registro + sonda de carrito/correo, sin depender del Header
// (que usa useRouter y no está disponible en el entorno de test).
function Harness() {
  const { register, user, cartCount, mail } = useStore();
  return (
    <div>
      {user ? (
        <span data-testid="who">{user.email}</span>
      ) : (
        <button
          data-testid="do-register"
          onClick={() =>
            register({ nombre: "Ada", email: "ada@example.com", password: "secreto1" })
          }
        >
          registrar
        </button>
      )}
      <span data-testid="probe-count">{cartCount}</span>
      <span data-testid="probe-mail">{mail.map((m) => m.kind).join(",")}</span>
      <Catalog products={PRODUCTS} categories={CATEGORIES} />
      <CartView />
      <Checkout />
    </div>
  );
}

function Shop() {
  return (
    <Providers>
      <Harness />
    </Providers>
  );
}

describe("Flujo carrito + checkout simulado", () => {
  it("añadir al carrito actualiza el total", async () => {
    const user = userEvent.setup();
    render(<Shop />);
    await user.click(screen.getByTestId("do-register"));

    const a = PRODUCTS[0];
    const b = PRODUCTS[1];
    await user.click(screen.getByTestId(`add-${a.id}`));
    await user.click(screen.getByTestId(`add-${b.id}`));

    expect(screen.getByTestId("probe-count")).toHaveTextContent("2");
    expect(screen.getByTestId("cart-total")).toHaveTextContent(
      money(a.precio_venta + b.precio_venta)
    );
  });

  it("incrementar cantidad recalcula el total", async () => {
    const user = userEvent.setup();
    render(<Shop />);
    await user.click(screen.getByTestId("do-register"));
    const a = PRODUCTS[0];

    await user.click(screen.getByTestId(`add-${a.id}`));
    await user.click(screen.getByTestId(`inc-${a.id}`));

    expect(screen.getByTestId(`qty-${a.id}`)).toHaveTextContent("2");
    expect(screen.getByTestId("cart-total")).toHaveTextContent(
      money(a.precio_venta * 2)
    );
  });

  it("genera correo de bienvenida al registrarse", async () => {
    const user = userEvent.setup();
    render(<Shop />);
    await user.click(screen.getByTestId("do-register"));
    expect(screen.getByTestId("probe-mail")).toHaveTextContent("bienvenida");
  });

  it("completa un pedido simulado (dirección → envío → pago) y muestra el resumen", async () => {
    const user = userEvent.setup();
    render(<Shop />);
    await user.click(screen.getByTestId("do-register"));

    const a = PRODUCTS[0];
    const b = PRODUCTS[1];
    await user.click(screen.getByTestId(`add-${a.id}`));
    await user.click(screen.getByTestId(`add-${b.id}`));

    const envio = 4.99; // Rapidex (primero)
    const total = a.precio_venta + b.precio_venta + envio;

    // Paso 1: dirección
    await user.type(screen.getByTestId("input-nombre"), "Ada Lovelace");
    await user.type(screen.getByTestId("input-calle"), "Calle Mayor 1");
    await user.type(screen.getByTestId("input-ciudad"), "Madrid");
    await user.type(screen.getByTestId("input-cp"), "28001");
    await user.click(screen.getByTestId("to-shipping"));

    // Paso 2: envío
    await user.click(screen.getByTestId("to-payment"));

    // Paso 3: pago con tarjeta de prueba
    await user.click(screen.getByTestId("use-demo-card"));
    await user.click(screen.getByTestId("pay-button"));

    // 3-D Secure simulado → confirmación
    await screen.findByTestId("order-confirmation", {}, { timeout: 4000 });

    expect(screen.getByTestId("order-id")).toHaveTextContent(/RS-/);
    expect(screen.getByTestId("order-total")).toHaveTextContent(money(total));
    expect(screen.getByTestId("order-items").children.length).toBe(2);

    // Carrito vacío y correo de pedido generado
    expect(screen.getByTestId("probe-count")).toHaveTextContent("0");
    expect(screen.getByTestId("probe-mail")).toHaveTextContent("pedido");
  });

  it("bloquea el checkout si no hay sesión", () => {
    render(
      <Providers>
        <Checkout />
      </Providers>
    );
    expect(screen.getByTestId("checkout-login")).toBeInTheDocument();
  });
});
