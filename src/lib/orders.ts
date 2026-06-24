import type { Address, CartItem, Order, OrderItem, User } from "./types";
import { getCarrier } from "./shipping";
import { genId, hashString, now } from "./storage";

export function cartItemsToOrderItems(items: CartItem[]): OrderItem[] {
  return items.map((i) => ({
    id: i.id,
    nombre: i.nombre,
    precio_venta: i.precio_venta,
    cantidad: i.cantidad,
  }));
}

function generarNumero(seed: string): string {
  const n = Math.abs(hashString(seed)) % 1000000;
  return `RS-${String(n).padStart(6, "0")}`;
}

function generarTracking(seed: string): string {
  const n = Math.abs(hashString("trk" + seed)) % 1_0000_0000;
  return `TRK${String(n).padStart(8, "0")}ES`;
}

export interface CrearPedidoInput {
  user: User;
  items: CartItem[];
  direccion: Address;
  carrierId: string;
  cardLast4: string;
}

export function crearPedido(input: CrearPedidoInput): Order {
  const carrier = getCarrier(input.carrierId);
  if (!carrier) throw new Error("Empresa de envío no válida.");
  if (input.items.length === 0) throw new Error("El carrito está vacío.");

  const subtotal = input.items.reduce(
    (s, i) => s + i.precio_venta * i.cantidad,
    0
  );
  const envio = carrier.precio;
  const id = genId("ord");
  const createdAt = now();

  return {
    id,
    numero: generarNumero(id),
    userId: input.user.id,
    createdAt,
    items: cartItemsToOrderItems(input.items),
    subtotal,
    envio,
    total: subtotal + envio,
    direccion: input.direccion,
    carrierId: carrier.id,
    carrierNombre: carrier.nombre,
    etaHoras: carrier.etaHoras,
    tracking: generarTracking(id),
    cardLast4: input.cardLast4,
    email: input.user.email,
  };
}

export interface TrackingStage {
  key: string;
  label: string;
  icono: string;
  /** Segundos desde la compra en los que se alcanza (cronología demo). */
  offsetSec: number;
}

/**
 * Cronología de seguimiento. En una tienda real serían horas/días; aquí se
 * comprime a minutos para que el seguimiento se vea AVANZAR en la demo.
 */
export const TRACKING_STAGES: TrackingStage[] = [
  { key: "confirmado", label: "Pedido confirmado", icono: "✅", offsetSec: 0 },
  { key: "preparando", label: "Preparando en almacén", icono: "📦", offsetSec: 30 },
  { key: "enviado", label: "Enviado", icono: "🚚", offsetSec: 90 },
  { key: "reparto", label: "En reparto", icono: "🛵", offsetSec: 180 },
  { key: "entregado", label: "Entregado", icono: "🏠", offsetSec: 300 },
];

export interface TrackingStageState extends TrackingStage {
  alcanzado: boolean;
  at: number | null;
}

export interface TrackingState {
  stages: TrackingStageState[];
  currentIndex: number;
  entregado: boolean;
  /** Entrega estimada "comercial" (24-72 h según transportista). */
  entregaEstimada: number;
}

export function computarTracking(order: Order, nowMs: number = Date.now()): TrackingState {
  const elapsedSec = (nowMs - order.createdAt) / 1000;
  const stages: TrackingStageState[] = TRACKING_STAGES.map((s) => ({
    ...s,
    alcanzado: elapsedSec >= s.offsetSec,
    at: elapsedSec >= s.offsetSec ? order.createdAt + s.offsetSec * 1000 : null,
  }));
  let currentIndex = 0;
  stages.forEach((s, i) => {
    if (s.alcanzado) currentIndex = i;
  });
  return {
    stages,
    currentIndex,
    entregado: stages[stages.length - 1].alcanzado,
    entregaEstimada: order.createdAt + order.etaHoras * 3600 * 1000,
  };
}
