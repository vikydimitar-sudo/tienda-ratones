"use client";

import type { ReactNode } from "react";
import { ToastProvider } from "./Toaster";
import { StoreProvider } from "./store";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <StoreProvider>{children}</StoreProvider>
    </ToastProvider>
  );
}
