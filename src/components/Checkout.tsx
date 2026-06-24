"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useStore } from "./store";
import { useToast } from "./Toaster";
import { formatEUR } from "@/lib/pricing";
import { CARRIERS, getCarrier } from "@/lib/shipping";
import {
  formatearNumero,
  ultimos4,
  validarTarjeta,
  TARJETA_DEMO,
  type DatosTarjeta,
} from "@/lib/payments";
import type { Address, Order } from "@/lib/types";

type Step = "address" | "shipping" | "payment";

const STEPS: { key: Step; label: string }[] = [
  { key: "address", label: "Dirección" },
  { key: "shipping", label: "Envío" },
  { key: "payment", label: "Pago" },
];

export function Checkout() {
  const { user, cart, cartTotal, checkout } = useStore();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>("address");
  const [verifying, setVerifying] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  const [address, setAddress] = useState<Address>({
    nombre: user?.nombre ?? "",
    calle: user?.direccion?.calle ?? "",
    ciudad: user?.direccion?.ciudad ?? "",
    cp: user?.direccion?.cp ?? "",
    pais: user?.direccion?.pais ?? "España",
  });
  const [carrierId, setCarrierId] = useState(CARRIERS[0].id);
  const [card, setCard] = useState<DatosTarjeta>({
    numero: "",
    titular: "",
    caducidad: "",
    cvv: "",
  });
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});

  const carrier = getCarrier(carrierId)!;
  const total = useMemo(() => cartTotal + carrier.precio, [cartTotal, carrier]);

  // --- Estados especiales ---
  if (order) {
    return <Confirmation order={order} />;
  }

  if (!user) {
    return (
      <div className="card text-center" data-testid="checkout-login">
        <p className="text-4xl">🔒</p>
        <p className="mt-3 text-slate-300">Inicia sesión para finalizar tu compra.</p>
        <Link href="/login?next=/checkout" className="btn-primary mt-5">
          Iniciar sesión
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="card text-center" data-testid="checkout-empty">
        <p className="text-slate-300">No hay productos para tramitar.</p>
        <Link href="/" className="btn-primary mt-4">
          Ver catálogo
        </Link>
      </div>
    );
  }

  const addressValid =
    address.nombre.trim() &&
    address.calle.trim() &&
    address.ciudad.trim() &&
    address.cp.trim();

  function pay() {
    const res = validarTarjeta(card);
    if (!res.valido) {
      setCardErrors(res.errores as Record<string, string>);
      toast("Revisa los datos de la tarjeta", "error");
      return;
    }
    setCardErrors({});
    setVerifying(true);
    // 3-D Secure simulado.
    window.setTimeout(() => {
      const o = checkout({
        direccion: address,
        carrierId,
        cardLast4: ultimos4(card.numero),
      });
      setVerifying(false);
      setOrder(o);
      toast("Pago aprobado ✓ Pedido confirmado");
    }, 1400);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <Stepper step={step} />

        {step === "address" && (
          <div className="card space-y-4" data-testid="step-address">
            <h2 className="text-lg font-semibold">Dirección de envío</h2>
            <Field label="Nombre y apellidos" id="nombre">
              <input
                id="nombre"
                className="input"
                data-testid="input-nombre"
                value={address.nombre}
                onChange={(e) => setAddress({ ...address, nombre: e.target.value })}
              />
            </Field>
            <Field label="Calle y número" id="calle">
              <input
                id="calle"
                className="input"
                data-testid="input-calle"
                value={address.calle}
                onChange={(e) => setAddress({ ...address, calle: e.target.value })}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Ciudad" id="ciudad">
                <input
                  id="ciudad"
                  className="input"
                  data-testid="input-ciudad"
                  value={address.ciudad}
                  onChange={(e) => setAddress({ ...address, ciudad: e.target.value })}
                />
              </Field>
              <Field label="Código postal" id="cp">
                <input
                  id="cp"
                  className="input"
                  data-testid="input-cp"
                  value={address.cp}
                  onChange={(e) => setAddress({ ...address, cp: e.target.value })}
                />
              </Field>
            </div>
            <button
              type="button"
              className="btn-primary w-full"
              data-testid="to-shipping"
              disabled={!addressValid}
              onClick={() => setStep("shipping")}
            >
              Continuar al envío →
            </button>
          </div>
        )}

        {step === "shipping" && (
          <div className="card space-y-3" data-testid="step-shipping">
            <h2 className="text-lg font-semibold">Empresa de envío</h2>
            {CARRIERS.map((c) => (
              <label
                key={c.id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                  carrierId === c.id
                    ? "border-accent/60 bg-accent/10"
                    : "border-white/10 bg-black/20 hover:bg-white/5"
                }`}
                data-testid={`carrier-${c.id}`}
              >
                <input
                  type="radio"
                  name="carrier"
                  className="accent-accent"
                  checked={carrierId === c.id}
                  onChange={() => setCarrierId(c.id)}
                />
                <span className="text-2xl">{c.icono}</span>
                <span className="flex-1">
                  <span className="block font-semibold">{c.nombre}</span>
                  <span className="text-xs text-slate-400">{c.descripcion}</span>
                </span>
                <span className="font-semibold">
                  {c.precio === 0 ? "Gratis" : formatEUR(c.precio)}
                </span>
              </label>
            ))}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setStep("address")}
              >
                ← Atrás
              </button>
              <button
                type="button"
                className="btn-primary flex-1"
                data-testid="to-payment"
                onClick={() => setStep("payment")}
              >
                Continuar al pago →
              </button>
            </div>
          </div>
        )}

        {step === "payment" && (
          <div className="card space-y-4" data-testid="step-payment">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Pago con tarjeta</h2>
              <button
                type="button"
                className="text-xs link"
                data-testid="use-demo-card"
                onClick={() => {
                  setCard(TARJETA_DEMO);
                  setCardErrors({});
                }}
              >
                Usar tarjeta de prueba
              </button>
            </div>

            <Field label="Número de tarjeta" id="card-number" error={cardErrors.numero}>
              <input
                id="card-number"
                inputMode="numeric"
                placeholder="4242 4242 4242 4242"
                className="input font-mono tracking-wider"
                data-testid="card-number"
                value={card.numero}
                onChange={(e) =>
                  setCard({ ...card, numero: formatearNumero(e.target.value) })
                }
              />
            </Field>
            <Field label="Titular" id="card-name" error={cardErrors.titular}>
              <input
                id="card-name"
                className="input uppercase"
                data-testid="card-name"
                value={card.titular}
                onChange={(e) => setCard({ ...card, titular: e.target.value })}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Caducidad (MM/AA)" id="card-exp" error={cardErrors.caducidad}>
                <input
                  id="card-exp"
                  placeholder="12/30"
                  className="input font-mono"
                  data-testid="card-exp"
                  value={card.caducidad}
                  onChange={(e) => setCard({ ...card, caducidad: e.target.value })}
                />
              </Field>
              <Field label="CVV" id="card-cvv" error={cardErrors.cvv}>
                <input
                  id="card-cvv"
                  inputMode="numeric"
                  placeholder="123"
                  className="input font-mono"
                  data-testid="card-cvv"
                  value={card.cvv}
                  onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                />
              </Field>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setStep("shipping")}
              >
                ← Atrás
              </button>
              <button
                type="button"
                className="btn-primary flex-1"
                data-testid="pay-button"
                onClick={pay}
              >
                🔒 Pagar {formatEUR(total)}
              </button>
            </div>
            <p className="text-center text-xs text-slate-500">
              Pago simulado: no se realiza ningún cobro. Validamos el formato como
              una pasarela real (Luhn, caducidad, CVV).
            </p>
          </div>
        )}
      </div>

      <OrderSummary total={total} envio={carrier.precio} subtotal={cartTotal} />

      {verifying && <ThreeDSecure />}
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const idx = STEPS.findIndex((s) => s.key === step);
  return (
    <ol className="flex items-center gap-2 text-sm" data-testid="stepper">
      {STEPS.map((s, i) => (
        <li key={s.key} className="flex items-center gap-2">
          <span
            className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${
              i <= idx ? "bg-accent text-base" : "bg-white/10 text-slate-400"
            }`}
          >
            {i + 1}
          </span>
          <span className={i <= idx ? "text-slate-100" : "text-slate-500"}>
            {s.label}
          </span>
          {i < STEPS.length - 1 && <span className="mx-1 text-slate-600">→</span>}
        </li>
      ))}
    </ol>
  );
}

function OrderSummary({
  subtotal,
  envio,
  total,
}: {
  subtotal: number;
  envio: number;
  total: number;
}) {
  const { cart } = useStore();
  return (
    <div className="card h-fit">
      <h2 className="mb-3 text-lg font-semibold">Tu pedido</h2>
      <ul className="space-y-2 text-sm">
        {cart.map((i) => (
          <li key={i.id} className="flex justify-between">
            <span className="text-slate-300">
              {i.nombre} × {i.cantidad}
            </span>
            <span>{formatEUR(i.precio_venta * i.cantidad)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 space-y-1 border-t border-white/10 pt-3 text-sm">
        <div className="flex justify-between text-slate-400">
          <span>Subtotal</span>
          <span>{formatEUR(subtotal)}</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Envío</span>
          <span>{envio === 0 ? "Gratis" : formatEUR(envio)}</span>
        </div>
        <div className="flex justify-between pt-1 text-lg font-bold">
          <span>Total</span>
          <span data-testid="checkout-total">{formatEUR(total)}</span>
        </div>
      </div>
    </div>
  );
}

function ThreeDSecure() {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm"
      data-testid="threeds"
    >
      <div className="glass-strong w-full max-w-sm rounded-2xl p-8 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <p className="mt-4 font-semibold">Verificación 3-D Secure</p>
        <p className="mt-1 text-sm text-slate-400">
          Confirmando con tu banco… (simulado)
        </p>
      </div>
    </div>
  );
}

function Confirmation({ order }: { order: Order }) {
  return (
    <div className="space-y-4 animate-fadein" data-testid="order-confirmation">
      <div className="card border-emerald-400/30 bg-emerald-400/10 text-center">
        <p className="text-5xl">🎉</p>
        <h2 className="mt-2 text-2xl font-bold text-emerald-100">
          ¡Pedido confirmado!
        </h2>
        <p className="mt-1 text-sm text-slate-300">
          Pedido <strong data-testid="order-id">{order.numero}</strong> ·
          llegará en aprox. {order.etaHoras} h con {order.carrierNombre}.
        </p>
        <p className="text-xs text-slate-400">
          Pago simulado con tarjeta terminada en {order.cardLast4}. Sin cobro real.
        </p>
      </div>

      <div className="card">
        <h3 className="mb-3 font-semibold">Resumen</h3>
        <ul className="space-y-2 text-sm" data-testid="order-items">
          {order.items.map((i) => (
            <li key={i.id} className="flex justify-between">
              <span>
                {i.nombre} × {i.cantidad}
              </span>
              <span>{formatEUR(i.precio_venta * i.cantidad)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-white/10 pt-3 text-lg font-bold">
          <span>Total</span>
          <span data-testid="order-total">{formatEUR(order.total)}</span>
        </div>
        <p className="mt-2 text-sm text-slate-400">
          Seguimiento: <span className="font-mono">{order.tracking}</span>
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/pedidos/${order.id}`}
          className="btn-primary"
          data-testid="track-order"
        >
          Seguir mi pedido →
        </Link>
        <Link href="/bandeja" className="btn-ghost">
          Ver correos
        </Link>
        <Link href="/" className="btn-subtle">
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}

function Field({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-rose-300">{error}</p>}
    </div>
  );
}
