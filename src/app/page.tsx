import Link from "next/link";
import { Catalog } from "@/components/Catalog";
import { CATEGORIES, PRODUCTS } from "@/lib/data";

export default function HomePage() {
  return (
    <div>
      <section className="card relative mb-10 overflow-hidden">
        <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-accent/20 blur-3xl animate-aurora" />
        <div className="relative">
          <span className="badge">Nuevo · Edición 2026</span>
          <h1 className="h-display mt-3">
            Ratones de ordenador,{" "}
            <span className="bg-gradient-to-r from-accent to-accent-soft bg-clip-text text-transparent">
              comparados de verdad
            </span>
          </h1>
          <p className="mt-3 max-w-2xl text-slate-400">
            Specs reales, comparador lado a lado, cuenta con pedidos, carrito que
            se guarda y checkout simulado con seguimiento en vivo. Todo gratis,
            sin cobros reales.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/comparar" className="btn-primary">
              Abrir comparador
            </Link>
            <Link href="/registro" className="btn-ghost">
              Crear cuenta
            </Link>
          </div>
        </div>
      </section>

      <Catalog products={PRODUCTS} categories={CATEGORIES} />
    </div>
  );
}
