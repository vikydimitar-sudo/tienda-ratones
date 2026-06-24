import { CartView } from "@/components/CartView";

export const metadata = {
  title: "Carrito — RatónStore",
};

export default function CarritoPage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight">Tu carrito</h1>
      <CartView />
    </div>
  );
}
