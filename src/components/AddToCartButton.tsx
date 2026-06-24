"use client";

import { useState } from "react";
import type { MouseProduct } from "@/lib/types";
import { useCart } from "./CartContext";

export function AddToCartButton({ product }: { product: MouseProduct }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      className="btn-primary w-full"
      data-testid={`add-${product.id}`}
      onClick={() => {
        add(product);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1200);
      }}
    >
      {added ? "✓ Añadido" : "Añadir al carrito"}
    </button>
  );
}
