import { describe, it, expect } from "vitest";
import {
  luhnValido,
  detectarMarca,
  caducidadValida,
  validarTarjeta,
  ultimos4,
  formatearNumero,
  TARJETA_DEMO,
} from "./payments";

const NOW = new Date("2026-06-24T00:00:00Z").getTime();

describe("payments", () => {
  it("valida con Luhn", () => {
    expect(luhnValido("4242 4242 4242 4242")).toBe(true);
    expect(luhnValido("4242 4242 4242 4241")).toBe(false);
    expect(luhnValido("1234")).toBe(false);
  });

  it("detecta la marca", () => {
    expect(detectarMarca("4242424242424242")).toBe("visa");
    expect(detectarMarca("5500005555555559")).toBe("mastercard");
    expect(detectarMarca("371449635398431")).toBe("amex");
  });

  it("valida caducidad MM/AA", () => {
    expect(caducidadValida("12/30", NOW)).toBe(true);
    expect(caducidadValida("01/20", NOW)).toBe(false);
    expect(caducidadValida("13/30", NOW)).toBe(false);
    expect(caducidadValida("badformat", NOW)).toBe(false);
  });

  it("formatea y enmascara", () => {
    expect(formatearNumero("4242424242424242")).toBe("4242 4242 4242 4242");
    expect(ultimos4("4242424242424242")).toBe("4242");
  });

  it("valida una tarjeta completa", () => {
    const ok = validarTarjeta(TARJETA_DEMO, NOW);
    expect(ok.valido).toBe(true);
    expect(ok.marca).toBe("visa");

    const bad = validarTarjeta(
      { numero: "1111", titular: "", caducidad: "00/00", cvv: "1" },
      NOW
    );
    expect(bad.valido).toBe(false);
    expect(bad.errores.numero).toBeTruthy();
    expect(bad.errores.titular).toBeTruthy();
    expect(bad.errores.caducidad).toBeTruthy();
    expect(bad.errores.cvv).toBeTruthy();
  });

  it("exige CVV de 4 dígitos en Amex", () => {
    const r = validarTarjeta(
      { numero: "371449635398431", titular: "X", caducidad: "12/30", cvv: "123" },
      NOW
    );
    expect(r.errores.cvv).toBeTruthy();
  });
});
