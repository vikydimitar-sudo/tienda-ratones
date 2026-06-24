"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/components/store";
import { useToast } from "@/components/Toaster";
import type { Address } from "@/lib/types";

export default function CuentaPage() {
  const { ready, user, saveAddress, logout, orders } = useStore();
  const { toast } = useToast();
  const router = useRouter();

  const [addr, setAddr] = useState<Address>({
    nombre: user?.direccion?.nombre ?? user?.nombre ?? "",
    calle: user?.direccion?.calle ?? "",
    ciudad: user?.direccion?.ciudad ?? "",
    cp: user?.direccion?.cp ?? "",
    pais: user?.direccion?.pais ?? "España",
  });

  if (!ready) return <p className="text-slate-400">Cargando…</p>;

  if (!user) {
    return (
      <div className="card mx-auto max-w-md text-center">
        <p className="text-slate-300">Inicia sesión para ver tu cuenta.</p>
        <Link href="/login?next=/cuenta" className="btn-primary mt-4">
          Iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="h-display">Mi cuenta</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card">
          <h2 className="text-lg font-semibold">Perfil</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-400">Nombre</dt>
              <dd>{user.nombre}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Acceso</dt>
              <dd className="capitalize">{user.provider}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Pedidos</dt>
              <dd>{orders.length}</dd>
            </div>
          </dl>
          <div className="mt-5 flex gap-3">
            <Link href="/pedidos" className="btn-ghost">
              Mis pedidos
            </Link>
            <button
              type="button"
              className="btn-subtle text-rose-300"
              onClick={() => {
                logout();
                router.push("/");
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        <form
          className="card space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            saveAddress(addr);
            toast("Dirección guardada");
          }}
        >
          <h2 className="text-lg font-semibold">Dirección de envío</h2>
          <input
            className="input"
            placeholder="Nombre"
            value={addr.nombre}
            onChange={(e) => setAddr({ ...addr, nombre: e.target.value })}
          />
          <input
            className="input"
            placeholder="Calle y número"
            value={addr.calle}
            onChange={(e) => setAddr({ ...addr, calle: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              className="input"
              placeholder="Ciudad"
              value={addr.ciudad}
              onChange={(e) => setAddr({ ...addr, ciudad: e.target.value })}
            />
            <input
              className="input"
              placeholder="CP"
              value={addr.cp}
              onChange={(e) => setAddr({ ...addr, cp: e.target.value })}
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Guardar dirección
          </button>
        </form>
      </div>
    </div>
  );
}
