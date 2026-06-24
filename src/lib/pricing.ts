/**
 * Margen fijo de la tienda. El precio de venta SIEMPRE se calcula
 * como precio_mercado + MARGEN, nunca se escribe a mano.
 */
export const MARGEN_VENTA = 20;

export function calcularPrecioVenta(precioMercado: number): number {
  return precioMercado + MARGEN_VENTA;
}

const formatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

export function formatEUR(value: number): string {
  return formatter.format(value);
}
