"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useStore } from "@/components/store";

export default function MailDetailPage() {
  const params = useParams<{ id: string }>();
  const { ready, user, mail, markMailRead } = useStore();

  const msg = mail.find((m) => m.id === params.id);

  useEffect(() => {
    if (msg && !msg.leido) markMailRead(msg.id);
  }, [msg, markMailRead]);

  if (!ready) return <p className="text-slate-400">Cargando…</p>;
  if (!user || !msg) {
    return (
      <div className="card mx-auto max-w-md text-center">
        <p className="text-slate-300">No encontramos ese correo.</p>
        <Link href="/bandeja" className="btn-primary mt-4">
          Volver a la bandeja
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/bandeja" className="text-sm link">
        ← Bandeja
      </Link>
      <article className="card mt-3">
        <h1 className="text-xl font-bold">{msg.asunto}</h1>
        <p className="mt-1 text-sm text-slate-400">
          De: {msg.remitente} · Para: {user.email}
        </p>
        <div className="mt-5 space-y-3 text-slate-200">
          {msg.cuerpo.map((linea, i) => (
            <p key={i} className="leading-relaxed">
              {linea}
            </p>
          ))}
        </div>
        {msg.orderId && (
          <Link
            href={`/pedidos/${msg.orderId}`}
            className="btn-primary mt-6"
          >
            Ver pedido y seguimiento →
          </Link>
        )}
      </article>
    </div>
  );
}
