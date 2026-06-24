"use client";

import Link from "next/link";
import { useStore } from "@/components/store";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS } from "@/lib/data";

export default function FavoritosPage() {
  const { wishlist } = useStore();
  const favoritos = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div>
      <h1 className="h-display mb-6">Favoritos ♥</h1>
      {favoritos.length === 0 ? (
        <div className="card text-center">
          <p className="text-slate-300">Aún no tienes favoritos.</p>
          <Link href="/" className="btn-primary mt-4">
            Explorar catálogo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favoritos.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
