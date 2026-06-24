"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "./store";
import { useToast } from "./Toaster";

export function AuthForm({
  mode,
  next = "/",
}: {
  mode: "login" | "registro";
  next?: string;
}) {
  const { login, register, loginGoogle } = useStore();
  const { toast } = useToast();
  const router = useRouter();
  const [form, setForm] = useState({ nombre: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const esRegistro = mode === "registro";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (esRegistro) {
        const u = register(form);
        toast(`¡Bienvenido/a, ${u.nombre}! Cuenta creada.`);
      } else {
        const u = login(form.email, form.password);
        toast(`Hola de nuevo, ${u.nombre.split(" ")[0]}`);
      }
      router.push(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    }
  }

  function google() {
    setError(null);
    const u = loginGoogle();
    toast(`Sesión iniciada con Google (demo)`);
    void u;
    router.push(next);
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="card">
        <h1 className="text-2xl font-bold">
          {esRegistro ? "Crear cuenta" : "Iniciar sesión"}
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          {esRegistro
            ? "Regístrate para guardar tu carrito y seguir tus pedidos."
            : "Accede a tu cuenta, pedidos y bandeja."}
        </p>

        <button
          type="button"
          onClick={google}
          className="btn-ghost mt-5 w-full"
          data-testid="google-login"
        >
          <span className="text-base">G</span> Continuar con Google
          <span className="ml-1 text-xs text-slate-500">(demo)</span>
        </button>

        <div className="my-4 flex items-center gap-3 text-xs text-slate-500">
          <span className="h-px flex-1 bg-white/10" /> o con email{" "}
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={submit} className="space-y-3" data-testid="auth-form">
          {esRegistro && (
            <div>
              <label className="label" htmlFor="nombre">
                Nombre
              </label>
              <input
                id="nombre"
                className="input"
                data-testid="auth-nombre"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
              />
            </div>
          )}
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input"
              data-testid="auth-email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              className="input"
              data-testid="auth-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-rose-300" data-testid="auth-error">
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary w-full" data-testid="auth-submit">
            {esRegistro ? "Crear cuenta" : "Entrar"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-400">
          {esRegistro ? (
            <>
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="link">
                Inicia sesión
              </Link>
            </>
          ) : (
            <>
              ¿Nuevo aquí?{" "}
              <Link href="/registro" className="link">
                Crea una cuenta
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
