/**
 * Validación de tarjeta SIMULADA: se valida el formato como una pasarela real
 * (Luhn, caducidad, CVV) pero NO se cobra ni se contacta con ningún banco.
 */

export type CardBrand = "visa" | "mastercard" | "amex" | "desconocida";

export function soloDigitos(s: string): string {
  return s.replace(/\D/g, "");
}

/** Algoritmo de Luhn (el mismo que usan las pasarelas reales). */
export function luhnValido(numero: string): boolean {
  const digits = soloDigitos(numero);
  if (digits.length < 12) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

export function detectarMarca(numero: string): CardBrand {
  const d = soloDigitos(numero);
  if (/^4/.test(d)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(d)) return "mastercard";
  if (/^3[47]/.test(d)) return "amex";
  return "desconocida";
}

export function ultimos4(numero: string): string {
  const d = soloDigitos(numero);
  return d.slice(-4).padStart(4, "•");
}

/** Formatea el número en grupos de 4 mientras se escribe. */
export function formatearNumero(numero: string): string {
  return soloDigitos(numero).slice(0, 19).replace(/(.{4})/g, "$1 ").trim();
}

/** Valida caducidad MM/AA. now en ms para poder testear. */
export function caducidadValida(mmYY: string, nowMs: number = Date.now()): boolean {
  const m = mmYY.match(/^(\d{2})\s*\/\s*(\d{2})$/);
  if (!m) return false;
  const mes = Number(m[1]);
  const anio = 2000 + Number(m[2]);
  if (mes < 1 || mes > 12) return false;
  const ahora = new Date(nowMs);
  // Válida hasta el último día del mes de caducidad.
  const finDeMes = new Date(anio, mes, 0, 23, 59, 59, 999).getTime();
  return finDeMes >= ahora.getTime();
}

export interface DatosTarjeta {
  numero: string;
  titular: string;
  caducidad: string;
  cvv: string;
}

export interface ResultadoValidacion {
  valido: boolean;
  errores: Partial<Record<keyof DatosTarjeta, string>>;
  marca: CardBrand;
}

export function validarTarjeta(
  datos: DatosTarjeta,
  nowMs: number = Date.now()
): ResultadoValidacion {
  const errores: Partial<Record<keyof DatosTarjeta, string>> = {};
  const marca = detectarMarca(datos.numero);

  if (!luhnValido(datos.numero)) errores.numero = "Número de tarjeta no válido.";
  if (!datos.titular.trim()) errores.titular = "Indica el titular.";
  if (!caducidadValida(datos.caducidad, nowMs))
    errores.caducidad = "Caducidad no válida (MM/AA).";

  const cvvLen = marca === "amex" ? 4 : 3;
  if (!new RegExp(`^\\d{${cvvLen}}$`).test(datos.cvv.trim()))
    errores.cvv = `CVV de ${cvvLen} dígitos.`;

  return { valido: Object.keys(errores).length === 0, errores, marca };
}

/** Tarjeta de prueba que SIEMPRE pasa (como las de las pasarelas en modo test). */
export const TARJETA_DEMO: DatosTarjeta = {
  numero: "4242 4242 4242 4242",
  titular: "USUARIO DEMO",
  caducidad: "12/30",
  cvv: "123",
};
