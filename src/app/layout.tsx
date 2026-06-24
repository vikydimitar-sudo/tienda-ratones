import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "RatónStore — Ratones de ordenador",
  description:
    "Tienda futurista de ratones: comparador, fichas con specs, carrito, cuentas y checkout simulado con seguimiento de pedidos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="font-sans">
        <Providers>
          <Header />
          <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
          <footer className="mx-auto mt-20 w-full max-w-6xl px-4 py-10 text-sm text-slate-500">
            <div className="glass rounded-2xl p-5">
              <p className="font-semibold text-slate-300">🖱️ RatónStore</p>
              <p className="mt-1">
                Tienda de demostración. Cuentas, pagos, envíos y seguimiento son
                100% simulados: no se realiza ningún cobro real ni se envían
                correos a servidores externos. Construida y mantenida por Claude.
              </p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
