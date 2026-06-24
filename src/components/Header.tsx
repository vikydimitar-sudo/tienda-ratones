"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "./store";

function IconBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-base">
      {count}
    </span>
  );
}

export function Header() {
  const { user, logout, cartCount, wishlist, unreadMail } = useStore();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [menu, setMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-base/70 backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3">
        <Link href="/" className="shrink-0 text-lg font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-accent to-accent-soft bg-clip-text text-transparent">
            🖱️ RatónStore
          </span>
        </Link>

        <form
          className="ml-2 hidden flex-1 sm:block"
          onSubmit={(e) => {
            e.preventDefault();
            router.push(`/buscar?q=${encodeURIComponent(q)}`);
          }}
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar ratones, marcas, categorías…"
            aria-label="Buscar"
            className="input"
            data-testid="search-input"
          />
        </form>

        <div className="ml-auto flex items-center gap-1">
          <Link href="/comparar" className="btn-subtle hidden md:inline-flex">
            Comparar
          </Link>

          <Link
            href="/favoritos"
            className="btn-subtle relative px-3"
            aria-label="Favoritos"
            data-testid="wishlist-link"
          >
            ♥<IconBadge count={wishlist.length} />
          </Link>

          {user && (
            <Link
              href="/bandeja"
              className="btn-subtle relative px-3"
              aria-label="Bandeja de entrada"
              data-testid="mail-link"
            >
              ✉<IconBadge count={unreadMail} />
            </Link>
          )}

          <Link
            href="/carrito"
            className="btn-ghost relative"
            data-testid="cart-link"
          >
            🛒 <span className="ml-1 hidden sm:inline">Carrito</span>
            <span
              className="ml-1.5 rounded-full bg-white/15 px-1.5 text-xs"
              data-testid="cart-count"
            >
              {cartCount}
            </span>
          </Link>

          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenu((v) => !v)}
                className="btn-ghost"
                data-testid="account-button"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-soft text-xs font-bold text-base">
                  {user.nombre.charAt(0).toUpperCase()}
                </span>
                <span className="hidden max-w-24 truncate sm:inline">
                  {user.nombre.split(" ")[0]}
                </span>
              </button>
              {menu && (
                <>
                  <button
                    className="fixed inset-0 z-10 cursor-default"
                    aria-hidden
                    onClick={() => setMenu(false)}
                  />
                  <div className="glass-strong absolute right-0 z-20 mt-2 w-52 rounded-2xl p-2 shadow-soft">
                    <MenuLink href="/pedidos" onClick={() => setMenu(false)}>
                      📦 Mis pedidos
                    </MenuLink>
                    <MenuLink href="/bandeja" onClick={() => setMenu(false)}>
                      ✉ Bandeja {unreadMail > 0 && `(${unreadMail})`}
                    </MenuLink>
                    <MenuLink href="/favoritos" onClick={() => setMenu(false)}>
                      ♥ Favoritos
                    </MenuLink>
                    <MenuLink href="/cuenta" onClick={() => setMenu(false)}>
                      ⚙ Mi cuenta
                    </MenuLink>
                    <button
                      type="button"
                      className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm text-rose-300 hover:bg-white/10"
                      data-testid="logout"
                      onClick={() => {
                        logout();
                        setMenu(false);
                        router.push("/");
                      }}
                    >
                      ⏻ Cerrar sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link href="/login" className="btn-primary" data-testid="login-link">
              Entrar
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

function MenuLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block rounded-xl px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
    >
      {children}
    </Link>
  );
}
