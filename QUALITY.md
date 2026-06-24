# 🧪 Departamento de Calidad — RatónStore

Plan de verificación **estricto**: nada se da por bueno hasta que pasa por aquí.
Cada punto indica si está **🤖 automatizado** (lo verifica la máquina y bloquea
el deploy si falla) o **👁 manual** (requiere revisión humana/visual).

**Comando único:** `npm run qa` → typecheck + lint + tests (incluida la suite de
calidad). En CI (`.github/workflows/ci.yml`) se ejecuta además `build` en cada
push y PR a `main`: si algo falla, **no se despliega**.

```bash
npm run qa            # typecheck + lint + tests (rápido, local)
npm run build         # build de producción
npm run optimize:images   # re-genera las imágenes WebP optimizadas
```

---

## 1. Datos y contenido
- 🤖 ≥ 6 productos, **ids únicos**. (`quality.test.ts`)
- 🤖 `precio_venta === precio_mercado + 20` en todos. (`quality.test.ts`, `pricing.test.ts`)
- 🤖 Campos obligatorios presentes y sensatos (specs > 0, descripción con cuerpo).
- 👁 Textos sin erratas, descripciones coherentes con el producto.
- 👁 Marca/modelo del texto no contradice la foto de forma flagrante.

## 2. Coherencia visual (el "bug del cable")
- 🤖 **Producto inalámbrico ⇒ su foto NO muestra cable.** (`imageManifest.ts` + `quality.test.ts`)
- 🤖 Categoría "Inalámbrico" ⇒ `conexion` distinta de "Cable".
- 🤖 Cada producto tiene **firma de verificación visual** (`verified: true`) en el manifiesto.
- 👁 Al cambiar cualquier foto: revisarla a ojo y actualizar `src/lib/imageManifest.ts`
  (`verified`, `muestraCable`). El test falla si falta la firma.
- 👁 Encuadre limpio: sin cajas/carteles/fondos sucios; el ratón es el protagonista.

## 3. Optimización y rendimiento (Core Web Vitals)
- 🤖 Todas las imágenes son **WebP**, existen y pesan **≤ 120 KB**. (`quality.test.ts`)
- 🤖 Imágenes redimensionadas a máx. 800 px (`scripts/optimize-images.mjs`, calidad 72).
- ✅ `next/image` con `width/height`/`fill` + `sizes` ⇒ **sin layout shift (CLS)**.
- ✅ Imagen principal de la ficha con `priority` (no se lazy-loadea el LCP);
  el resto, lazy por defecto.
- ✅ Vídeos pesados e irrelevantes **eliminados** (eran clips genéricos). Campo
  `video` opcional; si en el futuro se añade, debe ser stock libre y ligero
  (mp4 corto o GIF/WebM).
- ✅ Fuente con `next/font` (Inter) → self-host, sin FOIT/render-blocking.
- ✅ Páginas estáticas/SSG donde se puede (catálogo y fichas se pre-renderizan).
- 👁 Objetivo Lighthouse: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95.
  Medir con `npx lighthouse <url>` o PageSpeed Insights tras cada cambio grande.
- 👁 Peso total de la home y nº de peticiones razonables (revisar pestaña Network).

## 4. Funcionalidad (flujos de cliente)
- 🤖 Catálogo lista ≥ 6 y **filtros por categoría** funcionan. (`Catalog.test.tsx`)
- 🤖 Ficha muestra precio = mercado + 20 con su fórmula. (`producto.test.tsx`)
- 🤖 Comparador enfrenta ≥ 2 con specs lado a lado. (`Compare.test.tsx`)
- 🤖 Añadir al carrito actualiza el total; cantidades recalculan. (`CheckoutFlow.test.tsx`)
- 🤖 Registro genera correo de bienvenida; checkout requiere sesión. (`CheckoutFlow.test.tsx`)
- 🤖 Checkout multipaso completa pedido y muestra resumen. (`CheckoutFlow.test.tsx`)
- 🤖 Pago: validación Luhn/caducidad/CVV; tracking avanza; correos se generan. (`payments/orders.test.ts`)
- 👁 Probar a mano: registro → carrito → checkout → seguimiento → bandeja.
- 👁 Buscador devuelve resultados relevantes y maneja "sin resultados".

## 5. Código y arquitectura
- 🤖 **Typecheck** estricto sin errores (`tsc --noEmit`).
- 🤖 **Lint** limpio (`next lint`, incluye reglas de React y a11y).
- ✅ Lógica de negocio en módulos puros y testeables (`src/lib/*`).
- ✅ Estado centralizado (`store.tsx`), sin props-drilling ni duplicación.
- 👁 Sin código muerto, sin `console.log` de depuración, nombres claros.
- 👁 Componentes cliente solo donde hacen falta (`"use client"`).

## 6. Accesibilidad (a11y)
- 🤖 Reglas `jsx-a11y` vía `next/core-web-vitals` en lint.
- ✅ Imágenes con `alt` descriptivo; botones icónicos con `aria-label`.
- ✅ Formularios con `<label htmlFor>`; foco visible; navegación por teclado.
- 👁 Contraste suficiente sobre el tema oscuro (texto secundario incluido).
- 👁 Revisión con lector de pantalla / auditoría axe en cambios grandes.

## 7. SEO y metadatos
- ✅ `<title>`/`description` por página (Next Metadata API).
- ✅ `lang="es"`, estructura semántica (`header/main/footer`, encabezados).
- 👁 Pendiente opcional: Open Graph/Twitter cards, `sitemap.xml`, `robots.txt`,
  datos estructurados de producto (JSON-LD).

## 8. Responsive y compatibilidad
- ✅ Layout responsive (grid 1/2/3 columnas, header adaptable).
- 👁 Probar en móvil (~375px), tablet y escritorio.
- 👁 Probar en Chrome, Firefox y Safari (incl. `backdrop-filter` del glass).

## 9. Robustez y manejo de errores
- ✅ Estados vacíos (carrito, favoritos, pedidos, bandeja, búsqueda sin resultados).
- ✅ Rutas dinámicas inexistentes muestran aviso amable (pedido/correo no encontrado).
- ✅ Acceso a páginas privadas sin sesión → invitación a iniciar sesión.
- ✅ `localStorage` tolerante a datos corruptos / modo privado.
- 👁 404 global con diseño acorde (mejora pendiente).

## 10. Seguridad y privacidad
- ✅ Sin claves ni secretos en el repo; sin pagos/datos reales (todo simulado).
- ✅ Sin dependencias innecesarias; `npm audit` revisado en cambios de deps.
- 👁 Nota: el "hash" de contraseñas es demo, NO criptográfico (no hay datos reales).

## 11. Despliegue
- 🤖 **CI** (GitHub Actions) ejecuta typecheck+lint+test+build en cada push/PR.
- 🤖 Vercel construye en su infraestructura; si el build falla, no publica.
- ✅ Auto-deploy desde `main`; URL pública verificada (HTTP 200 en rutas clave).
- 👁 Tras desplegar: smoke test visual de la web en producción.

---

## Flujo del departamento de calidad (cada cambio)
1. Implementar el cambio.
2. Si toca imágenes: `npm run optimize:images` + **revisar a ojo** + actualizar `imageManifest.ts`.
3. `npm run qa` y `npm run build` en local → todo verde.
4. Commit + push → CI (quality gate) + auto-deploy de Vercel.
5. Smoke test visual en la URL pública.
