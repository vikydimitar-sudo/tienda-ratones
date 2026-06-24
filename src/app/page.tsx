import { Catalog } from "@/components/Catalog";
import { CATEGORIES, PRODUCTS } from "@/lib/data";

export default function HomePage() {
  return (
    <div>
      <section className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Ratones de ordenador, comparados de verdad
        </h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Catálogo con specs reales, comparador lado a lado, carrito y checkout
          simulado. Elige por categoría y encuentra tu próximo ratón.
        </p>
      </section>
      <Catalog products={PRODUCTS} categories={CATEGORIES} />
    </div>
  );
}
