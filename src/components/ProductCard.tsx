import Image from "next/image";
import Link from "next/link";
import type { MouseProduct } from "@/lib/types";
import { formatEUR } from "@/lib/pricing";
import { AddToCartButton } from "./AddToCartButton";

export function ProductCard({ product }: { product: MouseProduct }) {
  return (
    <article className="card flex flex-col gap-3" data-testid={`product-${product.id}`}>
      <Link href={`/producto/${product.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-black/30">
          <Image
            src={product.imagenes[0]}
            alt={product.nombre}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            unoptimized
          />
        </div>
      </Link>
      <div className="flex items-center justify-between gap-2">
        <span className="badge">{product.categoria}</span>
        <span className="text-xs text-slate-400">{product.marca}</span>
      </div>
      <Link href={`/producto/${product.id}`}>
        <h3 className="text-base font-semibold leading-tight hover:text-indigo-300">
          {product.nombre}
        </h3>
      </Link>
      <p className="line-clamp-2 text-sm text-slate-400">{product.descripcion}</p>
      <div className="mt-auto flex items-baseline gap-2">
        <span
          className="text-xl font-bold"
          data-testid={`price-${product.id}`}
        >
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
