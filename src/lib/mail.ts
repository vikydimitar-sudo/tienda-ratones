import type { MailMessage, Order, User } from "./types";
import { formatEUR } from "./pricing";
import { computarTracking } from "./orders";

/**
 * Correos SIMULADOS. No se envía nada a un servidor de email real; los mensajes
 * aparecen en la "Bandeja de entrada" dentro de la propia web.
 */

const REMITENTE = "RatónStore <pedidos@ratonstore.demo>";

export function correoBienvenida(user: User): MailMessage {
  return {
    id: `mail_${user.id}_bienvenida`,
    userId: user.id,
    kind: "bienvenida",
    asunto: "¡Bienvenido/a a RatónStore! 🖱️",
    remitente: REMITENTE,
    preview: "Tu cuenta está lista. Descubre nuestros ratones.",
    createdAt: user.createdAt,
    cuerpo: [
      `Hola ${user.nombre},`,
      "Tu cuenta en RatónStore se ha creado correctamente. Ya puedes guardar tu carrito, comprar y seguir tus pedidos.",
      "Recuerda: esta es una tienda de demostración. El checkout es simulado y no se realiza ningún cobro real.",
      "¡Gracias por unirte!",
    ],
  };
}

export function correoPedido(order: Order): MailMessage {
  return {
    id: `mail_${order.id}_pedido`,
    userId: order.userId,
    kind: "pedido",
    asunto: `Pedido confirmado ${order.numero} ✅`,
    remitente: REMITENTE,
    preview: `Hemos recibido tu pedido por ${formatEUR(order.total)}.`,
    createdAt: order.createdAt,
    orderId: order.id,
    cuerpo: [
      `Tu pedido ${order.numero} se ha confirmado.`,
      ...order.items.map((i) => `• ${i.nombre} × ${i.cantidad} — ${formatEUR(i.precio_venta * i.cantidad)}`),
      `Envío (${order.carrierNombre}): ${formatEUR(order.envio)}`,
      `Total: ${formatEUR(order.total)}`,
      `Pago simulado con tarjeta terminada en ${order.cardLast4}. No se ha realizado ningún cobro real.`,
      `Envío a: ${order.direccion.calle}, ${order.direccion.cp} ${order.direccion.ciudad}.`,
    ],
  };
}

export function correoEnvio(order: Order): MailMessage {
  return {
    id: `mail_${order.id}_envio`,
    userId: order.userId,
    kind: "envio",
    asunto: `Tu pedido ${order.numero} va en camino 🚚`,
    remitente: REMITENTE,
    preview: `Nº de seguimiento ${order.tracking}.`,
    createdAt: order.createdAt + 90 * 1000,
    orderId: order.id,
    cuerpo: [
      `¡Buenas noticias! Tu pedido ${order.numero} ha salido del almacén con ${order.carrierNombre}.`,
      `Número de seguimiento: ${order.tracking}`,
      "Puedes ver el estado en tiempo real desde la sección 'Mis pedidos'.",
    ],
  };
}

export function correoEntrega(order: Order): MailMessage {
  return {
    id: `mail_${order.id}_entrega`,
    userId: order.userId,
    kind: "entrega",
    asunto: `Pedido ${order.numero} entregado 🏠`,
    remitente: REMITENTE,
    preview: "Tu pedido ha sido entregado. ¡Que lo disfrutes!",
    createdAt: order.createdAt + 300 * 1000,
    orderId: order.id,
    cuerpo: [
      `Tu pedido ${order.numero} ha sido entregado.`,
      "Esperamos que disfrutes de tu compra. ¡Gracias por confiar en RatónStore!",
    ],
  };
}

/**
 * Asegura que existan los correos correspondientes al estado actual de cada
 * pedido (confirmación siempre; envío y entrega cuando el tracking los alcanza).
 * Función pura: devuelve el nuevo array de correos.
 */
export function reconciliarCorreos(
  orders: Order[],
  existentes: MailMessage[],
  nowMs: number = Date.now()
): MailMessage[] {
  const porId = new Map(existentes.map((m) => [m.id, m]));

  for (const order of orders) {
    const add = (m: MailMessage) => {
      if (!porId.has(m.id)) porId.set(m.id, m);
    };
    add(correoPedido(order));
    const tr = computarTracking(order, nowMs);
    const enviado = tr.stages.find((s) => s.key === "enviado");
    const entregado = tr.stages.find((s) => s.key === "entregado");
    if (enviado?.alcanzado) add(correoEnvio(order));
    if (entregado?.alcanzado) add(correoEntrega(order));
  }

  return Array.from(porId.values()).sort((a, b) => b.createdAt - a.createdAt);
}
