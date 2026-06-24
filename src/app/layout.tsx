import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "RatónStore — Tienda de ratones de ordenador",
  description:
    "Comparador, fichas con specs, carrito y checkout simulado de ratones de ordenador.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <CartProvider>
          <Header />
          <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
          <footer className="mx-auto mt-16 w-full max-w-6xl px-4 py-8 text-sm text-slate-400">
            RatónStore · Checkout simulado, sin cobros reales · Demo construida y
            mantenida por Claude.
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
