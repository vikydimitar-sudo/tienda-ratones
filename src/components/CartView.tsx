"use client";

import Link from "next/link";
import { useStore } from "./store";
import { formatEUR } from "@/lib/pricing";

export function CartView() {
  const { cart, cartTotal, setCartQty, removeFromCart } = useStore();

  if (cart.length === 0) {
    return (
      <div className="card text-center" data-testid="cart-empty">
        <p className="text-5xl">🛒</p>
        <p className="mt-3 text-slate-300">Tu carrito está vacío.</p>
        <Link href="/" className="btn-primary mt-5">
          Explorar catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <ul className="space-y-3" data-testid="cart-items">
        {cart.map((item) => (
          <li
            key={item.id}
            className="card flex items-center justify-between gap-4"
            data-testid={`cart-item-${item.id}`}
          >
            <div className="min-w-0">
              <Link
                href={`/producto/${item.id}`}
                className="font-semibold transition hover:text-accent"
              >
                {item.nombre}
              </Link>
              <p className="text-sm text-slate-400">
                {formatEUR(item.precio_venta)} / ud.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-black/30 p-1">
                <button
                  type="button"
                  className="h-7 w-7 rounded-lg hover:bg-white/10"
                  aria-label={`Restar ${item.nombre}`}
                  data-testid={`dec-${item.id}`}
                  onClick={() => setCartQty(item.id, item.cantidad - 1)}
                >
                  −
                </button>
                <span data-testid={`qty-${item.id}`} className="w-7 text-center text-sm">
                  {item.cantidad}
                </span>
                <button
                  type="button"
                  className="h-7 w-7 rounded-lg hover:bg-white/10"
                  aria-label={`Sumar ${item.nombre}`}
                  data-testid={`inc-${item.id}`}
                  onClick={() => setCartQty(item.id, item.cantidad + 1)}
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
                onClick={() => removeFromCart(item.id)}
              >
                Quitar
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="card h-fit">
        <h2 className="text-lg font-semibold">Resumen</h2>
        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
          <span className="text-slate-300">Total</span>
          <span className="text-2xl font-bold" data-testid="cart-total">
            {formatEUR(cartTotal)}
          </span>
        </div>
        <Link
          href="/checkout"
          className="btn-primary mt-5 w-full"
          data-testid="go-checkout"
        >
          Tramitar pedido →
        </Link>
        <p className="mt-3 text-center text-xs text-slate-500">
          Checkout simulado · sin cobro real
        </p>
      </div>
    </div>
  );
}
