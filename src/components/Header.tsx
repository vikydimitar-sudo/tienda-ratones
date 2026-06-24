"use client";

import Link from "next/link";
import { useCart } from "./CartContext";

export function Header() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-ink/80 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-lg font-extrabold tracking-tight">
          🖱️ RatónStore
        </Link>
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="btn-ghost">
            Catálogo
          </Link>
          <Link href="/comparar" className="btn-ghost">
            Comparador
          </Link>
          <Link href="/carrito" className="btn-primary" data-testid="cart-link">
            Carrito
            <span
              className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs"
              data-testid="cart-count"
            >
              {count}
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
