"use client";

import { useStore } from "./store";
import { useToast } from "./Toaster";

export function WishlistButton({
  id,
  nombre,
  className = "",
}: {
  id: string;
  nombre: string;
  className?: string;
}) {
  const { isWished, toggleWishlist } = useStore();
  const { toast } = useToast();
  const active = isWished(id);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? "Quitar de favoritos" : "Añadir a favoritos"}
      data-testid={`wish-${id}`}
      onClick={() => {
        toggleWishlist(id);
        toast(active ? `Quitado de favoritos` : `${nombre} en favoritos ♥`, "info");
      }}
      className={`grid h-9 w-9 place-items-center rounded-full border border-white/15 backdrop-blur transition ${
        active ? "bg-rose-500/30 text-rose-200" : "bg-black/30 text-slate-300 hover:bg-white/10"
      } ${className}`}
    >
      {active ? "♥" : "♡"}
    </button>
  );
}
