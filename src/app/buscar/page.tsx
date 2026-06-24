import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS } from "@/lib/data";

export const metadata = { title: "Buscar — RatónStore" };

function normaliza(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = normaliza(q.trim());
  const resultados = query
    ? PRODUCTS.filter((p) =>
        normaliza(
          `${p.nombre} ${p.marca} ${p.categoria} ${p.descripcion} ${p.specs.sensor}`
        ).includes(query)
      )
    : [];

  return (
    <div>
      <h1 className="h-display mb-1">Buscar</h1>
      <p className="mb-6 text-sm text-slate-400">
        {query
          ? `${resultados.length} resultado${resultados.length === 1 ? "" : "s"} para “${q}”`
          : "Escribe en la barra de búsqueda para encontrar ratones."}
      </p>

      {query && resultados.length === 0 ? (
        <div className="card text-center">
          <p className="text-slate-300">Sin resultados para “{q}”.</p>
          <Link href="/" className="btn-primary mt-4">
            Ver todo el catálogo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resultados.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
