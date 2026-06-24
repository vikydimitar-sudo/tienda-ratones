import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById, PRODUCTS } from "@/lib/data";
import { formatEUR, MARGEN_VENTA } from "@/lib/pricing";
import { AddToCartButton } from "@/components/AddToCartButton";
import { WishlistButton } from "@/components/WishlistButton";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  const specRows: { label: string; value: string }[] = [
    { label: "DPI", value: product.specs.dpi.toLocaleString("es-ES") },
    { label: "Sensor", value: product.specs.sensor },
    { label: "Peso", value: `${product.specs.peso_g} g` },
    { label: "Botones", value: String(product.specs.botones) },
    { label: "Conexión", value: product.specs.conexion },
    { label: "Polling", value: `${product.specs.polling_hz.toLocaleString("es-ES")} Hz` },
  ];

  return (
    <div>
      <Link href="/" className="text-sm link">
        ← Volver al catálogo
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-black/40">
            <Image
              src={product.imagenes[0]}
              alt={product.nombre}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              unoptimized
              priority
            />
          </div>
          {product.imagenes.length > 1 && (
            <div className="grid grid-cols-2 gap-4">
              {product.imagenes.slice(1).map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-[4/3] overflow-hidden rounded-xl bg-black/40"
                >
                  <Image
                    src={img}
                    alt={`${product.nombre} vista ${i + 2}`}
                    fill
                    sizes="25vw"
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          )}
          {product.video && (
            <video
              controls
              playsInline
              preload="metadata"
              className="w-full rounded-2xl border border-white/10"
              data-testid="product-video"
            >
              <source src={product.video} type="video/mp4" />
              Tu navegador no soporta vídeo HTML5.
            </video>
          )}
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <span className="badge">{product.categoria}</span>
            <span className="text-sm text-slate-400">{product.marca}</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl font-extrabold tracking-tight">
              {product.nombre}
            </h1>
            <WishlistButton id={product.id} nombre={product.nombre} />
          </div>
          <p className="text-slate-300">{product.descripcion}</p>

          <div className="card">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold" data-testid="sale-price">
                {formatEUR(product.precio_venta)}
              </span>
              <span className="text-sm text-slate-500 line-through">
                {formatEUR(product.precio_mercado)}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400" data-testid="price-formula">
              Precio de venta = precio de mercado ({formatEUR(product.precio_mercado)})
              + margen ({formatEUR(MARGEN_VENTA)})
            </p>
          </div>

          <AddToCartButton product={product} />

          <table className="w-full text-sm">
            <tbody>
              {specRows.map((row) => (
                <tr key={row.label} className="border-b border-white/10">
                  <th className="py-2.5 text-left font-medium text-slate-400">
                    {row.label}
                  </th>
                  <td className="py-2.5 text-right">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
