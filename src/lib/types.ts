export type Category = "Gaming" | "Oficina" | "Inalámbrico" | "Ergonómico";

export type Connection = "Cable" | "Inalámbrico" | "Bluetooth" | "Dual (2.4GHz + Bluetooth)";

export interface MouseSpecs {
  dpi: number;
  sensor: string;
  peso_g: number;
  botones: number;
  conexion: Connection;
  polling_hz: number;
}

/** Datos crudos del producto. precio_venta NO se almacena: se calcula. */
export interface MouseProductInput {
  id: string;
  nombre: string;
  marca: string;
  categoria: Category;
  specs: MouseSpecs;
  precio_mercado: number;
  imagenes: string[];
  video: string;
  descripcion: string;
}

/** Producto expuesto a la UI, con precio_venta calculado. */
export interface MouseProduct extends MouseProductInput {
  precio_venta: number;
}

export interface CartItem {
  id: string;
  nombre: string;
  precio_venta: number;
  cantidad: number;
}
