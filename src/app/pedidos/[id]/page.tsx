"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useStore } from "@/components/store";
import { useTick } from "@/components/useTick";
import { computarTracking } from "@/lib/orders";
import { formatEUR } from "@/lib/pricing";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { ready, user, getOrder } = useStore();
  useTick(3000);

  if (!ready) return <p className="text-slate-400">Cargando…</p>;
  if (!user) {
    return (
      <div className="card mx-auto max-w-md text-center">
        <p className="text-slate-300">Inicia sesión para ver este pedido.</p>
        <Link href="/login" className="btn-primary mt-4">
          Iniciar sesión
        </Link>
      </div>
    );
  }

  const order = getOrder(params.id);
  if (!order) {
    return (
      <div className="card mx-auto max-w-md text-center">
        <p className="text-slate-300">No encontramos ese pedido.</p>
        <Link href="/pedidos" className="btn-primary mt-4">
          Ver mis pedidos
        </Link>
      </div>
    );
  }

  const tr = computarTracking(order);
  const fecha = (ms: number) =>
    new Date(ms).toLocaleString("es-ES", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="space-y-6">
      <div>
        <Link href="/pedidos" className="text-sm link">
          ← Mis pedidos
        </Link>
        <h1 className="h-display mt-2">Pedido {order.numero}</h1>
        <p className="text-sm text-slate-400">
          Seguimiento <span className="font-mono">{order.tracking}</span> ·{" "}
          {order.carrierNombre}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="card" data-testid="tracking">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Seguimiento</h2>
            <span className="chip">
              Entrega estimada: {fecha(tr.entregaEstimada)}
            </span>
          </div>

          <ol className="relative ml-3 border-l border-white/10">
            {tr.stages.map((s, i) => (
              <li key={s.key} className="mb-6 ml-6 last:mb-0" data-testid={`stage-${s.key}`}>
                <span
                  className={`absolute -left-3 grid h-6 w-6 place-items-center rounded-full text-xs ${
                    s.alcanzado
                      ? "bg-accent text-base shadow-glow"
                      : "bg-white/10 text-slate-500"
                  }`}
                >
                  {s.alcanzado ? "✓" : i + 1}
                </span>
                <p
                  className={`font-medium ${s.alcanzado ? "text-slate-100" : "text-slate-500"}`}
                >
                  {s.icono} {s.label}
                </p>
                {s.at && (
                  <p className="text-xs text-slate-400">{fecha(s.at)}</p>
                )}
              </li>
            ))}
          </ol>

          {!tr.entregado && (
            <p className="mt-2 text-xs text-slate-500">
              El estado se actualiza solo. (Demo: el seguimiento avanza en
              minutos en lugar de horas para que puedas verlo progresar.)
            </p>
          )}
        </div>

        <div className="space-y-6">
          <div className="card">
            <h2 className="mb-3 text-lg font-semibold">Resumen</h2>
            <ul className="space-y-2 text-sm">
              {order.items.map((i) => (
                <li key={i.id} className="flex justify-between">
                  <span className="text-slate-300">
                    {i.nombre} × {i.cantidad}
                  </span>
                  <span>{formatEUR(i.precio_venta * i.cantidad)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 space-y-1 border-t border-white/10 pt-3 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>{formatEUR(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Envío</span>
                <span>{order.envio === 0 ? "Gratis" : formatEUR(order.envio)}</span>
              </div>
              <div className="flex justify-between pt-1 text-lg font-bold">
                <span>Total</span>
                <span>{formatEUR(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="card text-sm">
            <h2 className="mb-2 font-semibold">Envío a</h2>
            <p className="text-slate-300">
              {order.direccion.nombre}
              <br />
              {order.direccion.calle}
              <br />
              {order.direccion.cp} {order.direccion.ciudad} · {order.direccion.pais}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Pago simulado · tarjeta •••• {order.cardLast4}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
