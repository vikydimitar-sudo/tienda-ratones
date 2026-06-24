import { calcularPrecioVenta } from "./pricing";
import type { Category, MouseProduct, MouseProductInput } from "./types";

/**
 * Catálogo de ratones (datos crudos). Para añadir/editar productos basta
 * con tocar este array: el precio_venta se calcula automáticamente.
 * Imágenes y vídeo son placeholders/stock libre.
 */
const RAW_PRODUCTS: MouseProductInput[] = [
  {
    id: "viper-v3-pro",
    nombre: "Viper V3 Pro",
    marca: "RazerLike",
    categoria: "Gaming",
    specs: {
      dpi: 35000,
      sensor: "Focus Pro 35K",
      peso_g: 54,
      botones: 6,
      conexion: "Inalámbrico",
      polling_hz: 8000,
    },
    precio_mercado: 139,
    imagenes: ["/products/viper-v3-pro.webp"],
    descripcion:
      "Ratón gaming ultraligero de competición con sensor de 35.000 DPI y polling de 8.000 Hz para una respuesta instantánea.",
  },
  {
    id: "deathadder-essential",
    nombre: "DeathAdder Essential",
    marca: "RazerLike",
    categoria: "Gaming",
    specs: {
      dpi: 6400,
      sensor: "Óptico 6.4K",
      peso_g: 96,
      botones: 5,
      conexion: "Cable",
      polling_hz: 1000,
    },
    precio_mercado: 29,
    imagenes: [
      "/products/deathadder-essential.webp",
      "/products/deathadder-essential-2.webp",
    ],
    descripcion:
      "El clásico ergonómico para diestros. Fiable, cómodo y con un sensor óptico preciso a un precio de entrada.",
  },
  {
    id: "mx-master-4",
    nombre: "MX Master 4",
    marca: "Logiteck",
    categoria: "Oficina",
    specs: {
      dpi: 8000,
      sensor: "Darkfield 8K",
      peso_g: 141,
      botones: 7,
      conexion: "Dual (2.4GHz + Bluetooth)",
      polling_hz: 125,
    },
    precio_mercado: 119,
    imagenes: ["/products/mx-master-4.webp", "/products/mx-master-4-2.webp"],
    descripcion:
      "Ratón de productividad premium con rueda MagSpeed, scroll horizontal y seguimiento Darkfield en cualquier superficie, incluido cristal.",
  },
  {
    id: "pebble-2",
    nombre: "Pebble 2",
    marca: "Logiteck",
    categoria: "Oficina",
    specs: {
      dpi: 4000,
      sensor: "Óptico silencioso",
      peso_g: 76,
      botones: 3,
      conexion: "Bluetooth",
      polling_hz: 125,
    },
    precio_mercado: 25,
    imagenes: ["/products/pebble-2.webp", "/products/pebble-2-2.webp"],
    descripcion:
      "Ratón delgado, silencioso y portátil. Ideal para trabajar en bibliotecas o cafeterías sin molestar a nadie.",
  },
  {
    id: "g-pro-x-superlight",
    nombre: "G Pro X Superlight",
    marca: "Logiteck",
    categoria: "Inalámbrico",
    specs: {
      dpi: 32000,
      sensor: "Hero 2",
      peso_g: 60,
      botones: 5,
      conexion: "Inalámbrico",
      polling_hz: 2000,
    },
    precio_mercado: 159,
    imagenes: ["/products/g-pro-x-superlight.webp"],
    descripcion:
      "Inalámbrico de gama alta para esports: 60 g, deslizamiento perfecto y autonomía de hasta 95 horas.",
  },
  {
    id: "ergo-m575",
    nombre: "Ergo M575 Trackball",
    marca: "Logiteck",
    categoria: "Ergonómico",
    specs: {
      dpi: 2000,
      sensor: "Óptico trackball",
      peso_g: 145,
      botones: 5,
      conexion: "Dual (2.4GHz + Bluetooth)",
      polling_hz: 125,
    },
    precio_mercado: 49,
    imagenes: ["/products/ergo-m575.webp", "/products/ergo-m575-2.webp"],
    descripcion:
      "Trackball ergonómico que reduce el movimiento de muñeca. El pulgar controla el cursor: ideal para jornadas largas.",
  },
  {
    id: "vertical-lift",
    nombre: "Lift Vertical",
    marca: "Logiteck",
    categoria: "Ergonómico",
    specs: {
      dpi: 4000,
      sensor: "Óptico avanzado",
      peso_g: 125,
      botones: 6,
      conexion: "Dual (2.4GHz + Bluetooth)",
      polling_hz: 125,
    },
    precio_mercado: 69,
    imagenes: ["/products/vertical-lift.webp"],
    descripcion:
      "Diseño vertical a 57° que mantiene la muñeca en posición natural para prevenir molestias por uso prolongado.",
  },
  {
    id: "aerox-3-wireless",
    nombre: "Aerox 3 Wireless",
    marca: "SteelSeriez",
    categoria: "Inalámbrico",
    specs: {
      dpi: 18000,
      sensor: "TrueMove Air",
      peso_g: 66,
      botones: 6,
      conexion: "Dual (2.4GHz + Bluetooth)",
      polling_hz: 1000,
    },
    precio_mercado: 89,
    imagenes: ["/products/aerox-3-wireless.webp"],
    descripcion:
      "Ligero, resistente al agua y al polvo gracias a su diseño perforado AquaBarrier. Inalámbrico con doble conectividad.",
  },
];

/** Catálogo final con precio_venta calculado (precio_mercado + margen). */
export const PRODUCTS: MouseProduct[] = RAW_PRODUCTS.map((p) => ({
  ...p,
  precio_venta: calcularPrecioVenta(p.precio_mercado),
}));

export const CATEGORIES: Category[] = [
  "Gaming",
  "Oficina",
  "Inalámbrico",
  "Ergonómico",
];

export function getProductById(id: string): MouseProduct | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductsByCategory(categoria: Category | "Todos"): MouseProduct[] {
  if (categoria === "Todos") return PRODUCTS;
  return PRODUCTS.filter((p) => p.categoria === categoria);
}
