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

export type AuthProvider = "password" | "google";

export interface User {
  id: string;
  nombre: string;
  email: string;
  passwordHash: string;
  provider: AuthProvider;
  createdAt: number;
  direccion?: Address;
}

export interface Address {
  nombre: string;
  calle: string;
  ciudad: string;
  cp: string;
  pais: string;
}

export interface OrderItem {
  id: string;
  nombre: string;
  precio_venta: number;
  cantidad: number;
}

export interface Order {
  id: string;
  numero: string;
  userId: string;
  createdAt: number;
  items: OrderItem[];
  subtotal: number;
  envio: number;
  total: number;
  direccion: Address;
  carrierId: string;
  carrierNombre: string;
  etaHoras: number;
  tracking: string;
  cardLast4: string;
  email: string;
}

export type MailKind = "bienvenida" | "pedido" | "envio" | "entrega";

export interface MailMessage {
  id: string;
  userId: string;
  kind: MailKind;
  asunto: string;
  remitente: string;
  preview: string;
  createdAt: number;
  /** Bloques de texto que componen el cuerpo del correo. */
  cuerpo: string[];
  /** Pedido relacionado, si aplica. */
  orderId?: string;
  leido?: boolean;
}
