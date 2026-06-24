import type { User } from "./types";
import { genId, hashString, now } from "./storage";

/**
 * Autenticación simulada (100% en el navegador, sin servidor ni terceros).
 * El "hash" NO es criptográficamente seguro: esto es una demo sin datos reales.
 */

const SALT = "ratonstore::demo::v1";

export function hashPassword(password: string): string {
  return (hashString(SALT + password) >>> 0).toString(16);
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export function emailValido(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Devuelve un mensaje de error o null si la contraseña es válida. */
export function problemaPassword(password: string): string | null {
  if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres.";
  return null;
}

export interface RegistroInput {
  nombre: string;
  email: string;
  password: string;
}

/** Registra un usuario (función pura sobre el array de usuarios). */
export function registrarUsuario(
  users: User[],
  input: RegistroInput
): { users: User[]; user: User } {
  const nombre = input.nombre.trim();
  const email = input.email.trim().toLowerCase();

  if (!nombre) throw new Error("Introduce tu nombre.");
  if (!emailValido(email)) throw new Error("Email no válido.");
  const problema = problemaPassword(input.password);
  if (problema) throw new Error(problema);
  if (users.some((u) => u.email === email))
    throw new Error("Ya existe una cuenta con ese email.");

  const user: User = {
    id: genId("usr"),
    nombre,
    email,
    passwordHash: hashPassword(input.password),
    provider: "password",
    createdAt: now(),
  };
  return { users: [...users, user], user };
}

/** Inicia sesión con email + contraseña. Devuelve el usuario o lanza error. */
export function autenticar(users: User[], email: string, password: string): User {
  const e = email.trim().toLowerCase();
  const user = users.find((u) => u.email === e);
  if (!user || !verifyPassword(password, user.passwordHash))
    throw new Error("Email o contraseña incorrectos.");
  return user;
}

/**
 * Login con Google SIMULADO: no hay OAuth real. Crea (o reutiliza) una cuenta
 * marcada como provider "google".
 */
export function loginGoogleSimulado(
  users: User[],
  email = "demo.google@gmail.com",
  nombre = "Usuario Google (demo)"
): { users: User[]; user: User } {
  const e = email.trim().toLowerCase();
  const existente = users.find((u) => u.email === e);
  if (existente) return { users, user: existente };
  const user: User = {
    id: genId("usr"),
    nombre,
    email: e,
    passwordHash: "",
    provider: "google",
    createdAt: now(),
  };
  return { users: [...users, user], user };
}
