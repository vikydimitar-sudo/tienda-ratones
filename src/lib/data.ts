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
    imagenes: [
      "https://placehold.co/800x600/6366f1/ffffff/png?text=Viper+V3+Pro",
      "https://placehold.co/800x600/0b1020/ffffff/png?text=Viper+V3+lateral",
    ],
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
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
      "https://placehold.co/800x600/22c55e/ffffff/png?text=DeathAdder",
      "https://placehold.co/800x600/0b1020/ffffff/png?text=DeathAdder+top",
    ],
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
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
    imagenes: [
      "https://placehold.co/800x600/f59e0b/ffffff/png?text=MX+Master+4",
      "https://placehold.co/800x600/0b1020/ffffff/png?text=MX+Master+side",
    ],
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
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
    imagenes: [
      "https://placehold.co/800x600/64748b/ffffff/png?text=Pebble+2",
      "https://placehold.co/800x600/0b1020/ffffff/png?text=Pebble+2+top",
    ],
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
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
    imagenes: [
      "https://placehold.co/800x600/ec4899/ffffff/png?text=G+Pro+X",
      "https://placehold.co/800x600/0b1020/ffffff/png?text=G+Pro+X+base",
    ],
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
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
    imagenes: [
      "https://placehold.co/800x600/14b8a6/ffffff/png?text=Ergo+M575",
      "https://placehold.co/800x600/0b1020/ffffff/png?text=M575+trackball",
    ],
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
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
    imagenes: [
      "https://placehold.co/800x600/8b5cf6/ffffff/png?text=Lift+Vertical",
      "https://placehold.co/800x600/0b1020/ffffff/png?text=Lift+side",
    ],
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
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
    imagenes: [
      "https://placehold.co/800x600/ef4444/ffffff/png?text=Aerox+3",
      "https://placehold.co/800x600/0b1020/ffffff/png?text=Aerox+3+holes",
    ],
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
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
