"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

type ToastKind = "success" | "info" | "error";
interface Toast {
  id: number;
  msg: string;
  kind: ToastKind;
}

interface ToastValue {
  toast: (msg: string, kind?: ToastKind) => void;
}

const ToastContext = createContext<ToastValue | null>(null);

let counter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((msg: string, kind: ToastKind = "success") => {
    const id = ++counter;
    setToasts((prev) => [...prev, { id, msg, kind }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 left-1/2 z-50 flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`glass pointer-events-auto rounded-xl px-4 py-3 text-sm shadow-glow animate-rise ${
              t.kind === "error"
                ? "border-rose-400/40 text-rose-100"
                : t.kind === "info"
                  ? "border-cyan-400/40 text-cyan-50"
                  : "border-emerald-400/40 text-emerald-50"
            }`}
          >
            {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx;
}
