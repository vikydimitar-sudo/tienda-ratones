import { describe, it, expect } from "vitest";
import {
  registrarUsuario,
  autenticar,
  loginGoogleSimulado,
  hashPassword,
  verifyPassword,
  emailValido,
  problemaPassword,
} from "./auth";
import type { User } from "./types";

describe("auth", () => {
  it("valida email y contraseña", () => {
    expect(emailValido("a@b.com")).toBe(true);
    expect(emailValido("nope")).toBe(false);
    expect(problemaPassword("12345")).toBeTruthy();
    expect(problemaPassword("123456")).toBeNull();
  });

  it("hashea y verifica contraseñas", () => {
    const h = hashPassword("secreto123");
    expect(h).not.toBe("secreto123");
    expect(verifyPassword("secreto123", h)).toBe(true);
    expect(verifyPassword("otra", h)).toBe(false);
  });

  it("registra un usuario nuevo", () => {
    const { users, user } = registrarUsuario([], {
      nombre: "Ada",
      email: "Ada@Example.com",
      password: "secreto123",
    });
    expect(users).toHaveLength(1);
    expect(user.email).toBe("ada@example.com");
    expect(user.provider).toBe("password");
  });

  it("impide emails duplicados", () => {
    const { users } = registrarUsuario([], {
      nombre: "Ada",
      email: "ada@example.com",
      password: "secreto123",
    });
    expect(() =>
      registrarUsuario(users, {
        nombre: "Otra",
        email: "ada@example.com",
        password: "secreto123",
      })
    ).toThrow(/Ya existe/);
  });

  it("autentica con credenciales correctas y rechaza las malas", () => {
    const { users, user } = registrarUsuario([], {
      nombre: "Ada",
      email: "ada@example.com",
      password: "secreto123",
    });
    expect(autenticar(users, "ada@example.com", "secreto123").id).toBe(user.id);
    expect(() => autenticar(users, "ada@example.com", "mal")).toThrow();
    expect(() => autenticar(users, "no@existe.com", "x")).toThrow();
  });

  it("login Google simulado crea o reutiliza la cuenta", () => {
    const r1 = loginGoogleSimulado([]);
    expect(r1.user.provider).toBe("google");
    const r2 = loginGoogleSimulado(r1.users);
    expect(r2.users).toHaveLength(1);
    expect(r2.user.id).toBe(r1.user.id);
  });
});
