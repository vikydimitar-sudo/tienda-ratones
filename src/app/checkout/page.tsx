import { Checkout } from "@/components/Checkout";

export const metadata = {
  title: "Checkout — RatónStore",
};

export default function CheckoutPage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight">Checkout</h1>
      <Checkout />
    </div>
  );
}
