import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// jsdom does not implement matchMedia / scrollTo used by some components.
if (typeof window !== "undefined") {
  window.matchMedia =
    window.matchMedia ||
    ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
}

afterEach(() => {
  // Las suites en entorno "node" (p. ej. quality.test.ts) no tienen DOM/localStorage.
  if (typeof document !== "undefined") cleanup();
  if (typeof localStorage !== "undefined") localStorage.clear();
});
