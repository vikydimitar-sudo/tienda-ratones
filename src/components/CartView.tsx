"use client";

import Link from "next/link";
import { useCart } from "./CartContext";
import { formatEUR } from "@/lib/pricing";

export function CartView() {
  const { items, total, setQty, remove } = useCart();

  if (items.length === 0) {
    return (
      <div className="card" data-testid="cart-empty">
        <p className="text-slate-300">Tu carrito está vacío.</p>
        <Link href="/" className="btn-primary mt-4">
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-3" data-testid="cart-items">
        {items.map((item) => (
          <li
            key={item.id}
            className="card flex items-center justify-between gap-4"
            data-testid={`cart-item-${item.id}`}
          >
            <div className="min-w-0">
              <Link
                href={`/producto/${item.id}`}
                className="font-semibold hover:text-indigo-300"
              >
                {item.nombre}
              </Link>
              <p className="text-sm text-slate-400">
                {formatEUR(item.precio_venta)} / ud.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn-ghost px-3"
                  aria-label={`Restar ${item.nombre}`}
                  data-testid={`dec-${item.id}`}
                  onClick={() => setQty(item.id, item.cantidad - 1)}
                >
                  −
                </button>
                <span data-testid={`qty-${item.id}`} className="w-6 text-center">
                  {item.cantidad}
                </span>
                <button
                  type="button"
                  className="btn-ghost px-3"
                  aria-label={`Sumar ${item.nombre}`}
                  data-testid={`inc-${item.id}`}
                  onClick={() => setQty(item.id, item.cantidad + 1)}
                >
                  +
                </button>
              </div>
              <span
                className="w-20 text-right font-semibold"
                data-testid={`subtotal-${item.id}`}
              >
                {formatEUR(item.precio_venta * item.cantidad)}
              </span>
              <button
                type="button"
                className="text-sm text-rose-300 hover:underline"
                data-testid={`remove-${item.id}`}
                onClick={() => remove(item.id)}
              >
                Quitar
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="card flex items-center justify-between">
        <span className="text-lg font-semibold">Total</span>
        <span className="text-2xl font-bold" data-testid="cart-total">
          {formatEUR(total)}
        </span>
      </div>

      <div className="flex justify-end">
        <Link href="/checkout" className="btn-primary" data-testid="go-checkout">
          Tramitar pedido
        </Link>
      </div>
    </div>
  );
}
