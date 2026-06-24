"use client";

import { useState } from "react";
import Link from "next/link";
import type { MouseProduct } from "@/lib/types";
import { formatEUR } from "@/lib/pricing";

const SPEC_ROWS: { label: string; get: (p: MouseProduct) => string }[] = [
  { label: "Precio venta", get: (p) => formatEUR(p.precio_venta) },
  { label: "Precio mercado", get: (p) => formatEUR(p.precio_mercado) },
  { label: "Categoría", get: (p) => p.categoria },
  { label: "Marca", get: (p) => p.marca },
  { label: "DPI", get: (p) => p.specs.dpi.toLocaleString("es-ES") },
  { label: "Sensor", get: (p) => p.specs.sensor },
  { label: "Peso (g)", get: (p) => String(p.specs.peso_g) },
  { label: "Botones", get: (p) => String(p.specs.botones) },
  { label: "Conexión", get: (p) => p.specs.conexion },
  { label: "Polling (Hz)", get: (p) => p.specs.polling_hz.toLocaleString("es-ES") },
];

export function Compare({ products }: { products: MouseProduct[] }) {
  const [selected, setSelected] = useState<string[]>(
    products.slice(0, 2).map((p) => p.id)
  );

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  const chosen = products.filter((p) => selected.includes(p.id));

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2" data-testid="compare-selectors">
        {products.map((p) => {
          const active = selected.includes(p.id);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => toggle(p.id)}
              aria-pressed={active}
              data-testid={`compare-toggle-${p.id}`}
              className={
                active
                  ? "btn bg-accent text-white"
                  : "btn border border-white/15 text-slate-200 hover:bg-white/10"
              }
            >
              {p.nombre}
            </button>
          );
        })}
      </div>

      {chosen.length < 2 ? (
        <p className="card text-slate-300" data-testid="compare-hint">
          Selecciona al menos 2 productos para compararlos.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm" data-testid="compare-table">
            <thead>
              <tr>
                <th className="p-3 text-left text-slate-400">Spec</th>
                {chosen.map((p) => (
                  <th key={p.id} className="p-3 text-left">
                    <Link
                      href={`/producto/${p.id}`}
                      className="font-semibold hover:text-indigo-300"
                    >
                      {p.nombre}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SPEC_ROWS.map((row) => (
                <tr key={row.label} className="border-t border-white/10">
                  <th className="p-3 text-left font-medium text-slate-400">
                    {row.label}
                  </th>
                  {chosen.map((p) => (
                    <td
                      key={p.id}
                      className="p-3"
                      data-testid={`compare-${row.label}-${p.id}`}
                    >
                      {row.get(p)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
