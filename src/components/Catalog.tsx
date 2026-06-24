"use client";

import { useMemo, useState } from "react";
import type { Category, MouseProduct } from "@/lib/types";
import { ProductCard } from "./ProductCard";

type Filter = Category | "Todos";

export function Catalog({
  products,
  categories,
}: {
  products: MouseProduct[];
  categories: Category[];
}) {
  const [filter, setFilter] = useState<Filter>("Todos");

  const filtered = useMemo(
    () => (filter === "Todos" ? products : products.filter((p) => p.categoria === filter)),
    [products, filter]
  );

  const options: Filter[] = ["Todos", ...categories];

  return (
    <div>
      <div
        className="mb-6 flex flex-wrap gap-2"
        role="group"
        aria-label="Filtrar por categoría"
      >
        {options.map((opt) => {
          const active = opt === filter;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => setFilter(opt)}
              aria-pressed={active}
              data-testid={`filter-${opt}`}
              className={
                active
                  ? "btn bg-accent text-white"
                  : "btn border border-white/15 text-slate-200 hover:bg-white/10"
              }
            >
              {opt}
            </button>
          );
        })}
      </div>

      <p className="mb-4 text-sm text-slate-400" data-testid="result-count">
        {filtered.length} producto{filtered.length === 1 ? "" : "s"}
      </p>

      <div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        data-testid="product-grid"
      >
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
