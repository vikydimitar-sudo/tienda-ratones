"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "./CartContext";
import { formatEUR } from "@/lib/pricing";
import type { CartItem } from "@/lib/types";

interface Order {
  id: string;
  nombre: string;
  email: string;
  direccion: string;
  items: CartItem[];
  total: number;
}

function generarNumeroPedido(): string {
  // Pedido simulado: identificador legible basado en la fecha.
  const ts = Date.now().toString(36).toUpperCase();
  return `RS-${ts}`;
}

export function Checkout() {
  const { items, total, clear } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [form, setForm] = useState({ nombre: "", email: "", direccion: "" });

  // Pedido confirmado: resumen.
  if (order) {
    return (
      <div className="space-y-4" data-testid="order-confirmation">
        <div className="card border-emerald-400/30 bg-emerald-400/10">
          <h2 className="text-xl font-bold text-emerald-200">
            ✓ ¡Pedido confirmado!
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            Pedido simulado{" "}
            <strong data-testid="order-id">{order.id}</strong> registrado a
            nombre de {order.nombre}. No se ha realizado ningún cobro real.
          </p>
        </div>

        <div className="card">
          <h3 className="mb-3 font-semibold">Resumen</h3>
          <ul className="space-y-2 text-sm" data-testid="order-items">
            {order.items.map((i) => (
              <li key={i.id} className="flex justify-between">
                <span>
                  {i.nombre} × {i.cantidad}
                </span>
                <span>{formatEUR(i.precio_venta * i.cantidad)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-white/10 pt-3 text-lg font-bold">
            <span>Total</span>
            <span data-testid="order-total">{formatEUR(order.total)}</span>
          </div>
          <p className="mt-2 text-sm text-slate-400">
            Envío a: {order.direccion} · {order.email}
          </p>
        </div>

        <Link href="/" className="btn-primary" data-testid="back-home">
          Seguir comprando
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="card" data-testid="checkout-empty">
        <p className="text-slate-300">No hay productos para tramitar.</p>
        <Link href="/" className="btn-primary mt-4">
          Ver catálogo
        </Link>
      </div>
    );
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const confirmed: Order = {
      id: generarNumeroPedido(),
      nombre: form.nombre,
      email: form.email,
      direccion: form.direccion,
      items,
      total,
    };
    setOrder(confirmed);
    clear();
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <form className="card space-y-4" onSubmit={onSubmit} data-testid="checkout-form">
        <h2 className="text-lg font-semibold">Datos de envío</h2>
        <div>
          <label className="mb-1 block text-sm text-slate-400" htmlFor="nombre">
            Nombre completo
          </label>
          <input
            id="nombre"
            required
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2"
            data-testid="input-nombre"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-slate-400" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2"
            data-testid="input-email"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-slate-400" htmlFor="direccion">
            Dirección
          </label>
          <input
            id="direccion"
            required
            value={form.direccion}
            onChange={(e) => setForm({ ...form, direccion: e.target.value })}
            className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2"
            data-testid="input-direccion"
          />
        </div>
        <button type="submit" className="btn-primary w-full" data-testid="confirm-order">
          Confirmar pedido · {formatEUR(total)}
        </button>
        <p className="text-xs text-slate-500">
          Checkout simulado: no se solicita ni procesa ningún pago real.
        </p>
      </form>

      <div className="card h-fit">
        <h2 className="mb-3 text-lg font-semibold">Tu pedido</h2>
        <ul className="space-y-2 text-sm">
          {items.map((i) => (
            <li key={i.id} className="flex justify-between">
              <span>
                {i.nombre} × {i.cantidad}
              </span>
              <span>{formatEUR(i.precio_venta * i.cantidad)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-white/10 pt-3 text-lg font-bold">
          <span>Total</span>
          <span data-testid="checkout-total">{formatEUR(total)}</span>
        </div>
      </div>
    </div>
  );
}
