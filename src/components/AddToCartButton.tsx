"use client";

import { useState } from "react";
import type { MouseProduct } from "@/lib/types";
import { useStore } from "./store";
import { useToast } from "./Toaster";

export function AddToCartButton({
  product,
  className = "",
}: {
  product: MouseProduct;
  className?: string;
}) {
  const { addToCart } = useStore();
  const { toast } = useToast();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      className={`btn-primary w-full ${className}`}
      data-testid={`add-${product.id}`}
      onClick={() => {
        addToCart(product);
        toast(`${product.nombre} añadido al carrito`);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1200);
      }}
    >
      {added ? "✓ Añadido" : "Añadir al carrito"}
    </button>
  );
}
