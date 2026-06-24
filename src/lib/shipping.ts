/** Empresas de envío SIMULADAS (no son reales, no se contrata nada). */

export interface Carrier {
  id: string;
  nombre: string;
  precio: number;
  etaHoras: number;
  icono: string;
  descripcion: string;
}

export const CARRIERS: Carrier[] = [
  {
    id: "rapidex",
    nombre: "Rapidex Express",
    precio: 4.99,
    etaHoras: 24,
    icono: "🚀",
    descripcion: "Entrega en 24 h",
  },
  {
    id: "enviaseguro",
    nombre: "EnvíaSeguro",
    precio: 2.49,
    etaHoras: 48,
    icono: "📦",
    descripcion: "Entrega en 48 h",
  },
  {
    id: "estandar",
    nombre: "Estándar Gratis",
    precio: 0,
    etaHoras: 72,
    icono: "🚚",
    descripcion: "Entrega en 72 h · gratis",
  },
];

export function getCarrier(id: string): Carrier | undefined {
  return CARRIERS.find((c) => c.id === id);
}
