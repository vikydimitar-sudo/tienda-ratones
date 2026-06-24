"use client";

import Link from "next/link";
import { useStore } from "@/components/store";
import { useTick } from "@/components/useTick";

export default function BandejaPage() {
  const { ready, user, mail } = useStore();
  useTick(8000);

  if (!ready) return <p className="text-slate-400">Cargando…</p>;
  if (!user) {
    return (
      <div className="card mx-auto max-w-md text-center">
        <p className="text-slate-300">Inicia sesión para ver tu bandeja.</p>
        <Link href="/login?next=/bandeja" className="btn-primary mt-4">
          Iniciar sesión
        </Link>
      </div>
    );
  }

  const fecha = (ms: number) =>
    new Date(ms).toLocaleString("es-ES", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div>
      <h1 className="h-display mb-1">Bandeja de entrada</h1>
      <p className="mb-6 text-sm text-slate-400">
        Correos simulados (bienvenida, confirmación de pedido, envío y entrega).
        No se envían a ningún servidor real.
      </p>

      {mail.length === 0 ? (
        <div className="card text-center text-slate-300">No tienes correos.</div>
      ) : (
        <ul className="space-y-2" data-testid="mail-list">
          {mail.map((m) => (
            <li key={m.id}>
              <Link
                href={`/bandeja/${m.id}`}
                className={`card flex items-center justify-between gap-4 transition hover:shadow-glow ${
                  m.leido ? "opacity-70" : ""
                }`}
                data-testid={`mail-${m.kind}`}
              >
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-semibold">
                    {!m.leido && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
                    )}
                    <span className="truncate">{m.asunto}</span>
                  </p>
                  <p className="truncate text-sm text-slate-400">{m.preview}</p>
                </div>
                <span className="shrink-0 text-xs text-slate-500">
                  {fecha(m.createdAt)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
