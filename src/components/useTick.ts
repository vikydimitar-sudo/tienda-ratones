"use client";

import { useEffect, useState } from "react";

/** Fuerza re-render cada `ms` para refrescar estados derivados del tiempo. */
export function useTick(ms = 5000): number {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), ms);
    return () => clearInterval(t);
  }, [ms]);
  return tick;
}
