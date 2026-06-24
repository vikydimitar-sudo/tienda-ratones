"use client";

import Link from "next/link";
import { useStore } from "@/components/store";
import { formatEUR } from "@/lib/pricing";
import { computarTracking } from "@/lib/orders";
import { useTick } from "@/components/useTick";

export default function PedidosPage() {
  const { ready, user, orders } = useStore();
  useTick(5000);

  if (!ready) return <p className="text-slate-400">Cargando…</p>;

  if (!user) {
    return (
      <div className="card mx-auto max-w-md text-center">
        <p className="text-slate-300">Inicia sesión para ver tus pedidos.</p>
        <Link href="/login?next=/pedidos" className="btn-primary mt-4">
          Iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="h-display mb-6">Mis pedidos</h1>
      {orders.length === 0 ? (
        <div className="card text-center">
          <p className="text-slate-300">Todavía no has hecho ningún pedido.</p>
          <Link href="/" className="btn-primary mt-4">
            Ir a comprar
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((o) => {
            const tr = computarTracking(o);
            const stage = tr.stages[tr.currentIndex];
            return (
              <li key={o.id}>
                <Link
                  href={`/pedidos/${o.id}`}
                  className="card flex items-center justify-between gap-4 transition hover:shadow-glow"
                  data-testid={`order-${o.id}`}
                >
                  <div>
                    <p className="font-semibold">{o.numero}</p>
                    <p className="text-sm text-slate-400">
                      {o.items.reduce((s, i) => s + i.cantidad, 0)} artículos ·{" "}
                      {formatEUR(o.total)}
                    </p>
                  </div>
                  <span
                    className={`chip ${
                      tr.entregado ? "border-emerald-400/40 text-emerald-200" : "text-accent"
                    }`}
                  >
                    {stage.icono} {stage.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
