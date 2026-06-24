import Image from "next/image";
import Link from "next/link";
import type { MouseProduct } from "@/lib/types";
import { formatEUR } from "@/lib/pricing";
import { AddToCartButton } from "./AddToCartButton";
import { WishlistButton } from "./WishlistButton";

export function ProductCard({ product }: { product: MouseProduct }) {
  return (
    <article
      className="card group flex flex-col gap-3 transition hover:-translate-y-1 hover:shadow-glow"
      data-testid={`product-${product.id}`}
    >
      <div className="relative">
        <Link href={`/producto/${product.id}`} className="block">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-black/40">
            <Image
              src={product.imagenes[0]}
              alt={product.nombre}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-105"
              unoptimized
            />
          </div>
        </Link>
        <div className="absolute right-2 top-2">
          <WishlistButton id={product.id} nombre={product.nombre} />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="badge">{product.categoria}</span>
        <span className="text-xs text-slate-400">{product.marca}</span>
      </div>

      <Link href={`/producto/${product.id}`}>
        <h3 className="text-base font-semibold leading-tight transition hover:text-accent">
          {product.nombre}
        </h3>
      </Link>
      <p className="line-clamp-2 text-sm text-slate-400">{product.descripcion}</p>

      <div className="mt-auto flex items-baseline gap-2">
        <span className="text-xl font-bold" data-testid={`price-${product.id}`}>
          {formatEUR(product.precio_venta)}
        </span>
        <span className="text-xs text-slate-500 line-through">
          {formatEUR(product.precio_mercado)}
        </span>
      </div>
      <AddToCartButton product={product} />
    </article>
  );
}
