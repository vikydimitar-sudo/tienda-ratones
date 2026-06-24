# 🖱️ RatónStore — Tienda de ratones de ordenador

Tienda online **100% funcional** de ratones de ordenador con comparador,
fichas de producto (specs + fotos + vídeo), carrito y **checkout simulado**
(sin pasarela de pago real). Pensada para ser **actualizada por Claude**:
editar archivos → `git push` → redeploy automático en Vercel.

## 🌐 Enlaces

- **Web pública:** https://tienda-ratones.vercel.app
- **Repositorio:** https://github.com/vikydimitar-sudo/tienda-ratones

## 🧱 Stack y por qué

| Pieza | Elección | Por qué |
|-------|----------|---------|
| Framework | **Next.js 15 (App Router) + React 19 + TypeScript** | Integración nativa con Vercel (deploy y auto-deploy sin tarjeta), renderizado estático de las fichas (rápido y gratis), y un único proyecto para UI + rutas. |
| Estilos | **Tailwind CSS** | Estilado rápido y consistente sin CSS suelto. |
| Datos | **Módulo TypeScript estático** (`src/lib/data.ts`) | Coste cero (sin base de datos), y trivial de editar para añadir/cambiar productos. |
| Tests | **Vitest + Testing Library (jsdom)** | Rápidos, corren en CI/local sin navegador, cubren lógica y componentes. |
| Hosting | **Vercel (Hobby / free tier)** | Gratis, sin tarjeta, auto-deploy desde GitHub en cada push. |

**Alternativas consideradas:** Vite+React SPA (requeriría configurar routing y
un hosting estático aparte), Astro (excelente para contenido, pero el carrito
interactivo es más natural en React/Next) y SvelteKit. Se eligió Next por la
integración más estrecha con Vercel y porque facilita que Claude edite y
redespliegue.

## 💸 Precio de venta (regla de negocio)

El **precio de venta se calcula SIEMPRE**, nunca se escribe a mano:

```
precio_venta = precio_mercado + 20   (MARGEN_VENTA)
```

Definido en [`src/lib/pricing.ts`](src/lib/pricing.ts) y aplicado a todo el
catálogo en [`src/lib/data.ts`](src/lib/data.ts). Hay tests que verifican el
cálculo para todos los productos.

## ✨ Funcionalidades

- **Home** (`/`) con catálogo y **filtros por categoría**.
- **Ficha** (`/producto/[id]`) con specs, varias fotos, vídeo y el precio
  calculado (mostrando la fórmula).
- **Comparador** (`/comparar`): enfrenta 2 o más ratones con sus specs lado a lado.
- **Carrito** (`/carrito`): añade, cambia cantidades, ve el total en vivo
  (persistido en `localStorage`).
- **Checkout simulado** (`/checkout`): formulario de envío, confirma el pedido,
  genera un nº de pedido y muestra el resumen. **No hay cobro real.**

## 🚀 Cómo Claude actualiza la web a futuro

Esta es la parte importante: el dueño dice *"cambia esto / sube esto"* y Claude
lo hace editando el repo. El flujo es:

1. **Editar** los archivos relevantes:
   - **Añadir / editar / quitar un ratón:** editar el array `RAW_PRODUCTS` en
     [`src/lib/data.ts`](src/lib/data.ts). El `precio_venta` se recalcula solo.
   - **Cambiar el margen:** `MARGEN_VENTA` en
     [`src/lib/pricing.ts`](src/lib/pricing.ts).
   - **Textos / diseño:** componentes en `src/components/` y páginas en `src/app/`.
2. **Verificar en local** que todo sigue verde:
   ```bash
   npm install      # solo la primera vez
   npm run lint
   npm test
   npm run build
   ```
3. **Publicar:**
   ```bash
   git add -A
   git commit -m "Descripción del cambio"
   git push
   ```
4. **Redeploy automático:** Vercel está conectado a este repo de GitHub, así que
   cada `push` a la rama `main` dispara un **deploy automático**. En ~1 minuto la
   web pública queda actualizada. (Deploy manual alternativo: `vercel --prod`.)

## 🛠️ Desarrollo local

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint     # ESLint
npm test         # Vitest (23 tests)
npm run build    # build de producción
```

## ✅ Definición de Hecho (estado)

- [x] Build sin errores, linter limpio.
- [x] Home lista ≥ 6 productos con filtros por categoría.
- [x] Cada ficha muestra precio = precio_mercado + 20 (verificado por tests).
- [x] Comparador enfrenta ≥ 2 productos con specs lado a lado.
- [x] Añadir al carrito actualiza el total.
- [x] Checkout simulado completa un pedido y muestra el resumen.
- [x] Repo Git propio + desplegado con auto-deploy.
- [x] README con el flujo de actualización (este documento).

---

_Checkout simulado: esta tienda no procesa pagos reales. Imágenes y vídeos son
placeholders / contenido de stock libre._
