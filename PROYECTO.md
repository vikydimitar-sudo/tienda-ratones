\# OBJETIVO FINAL

Tienda online de ratones de ordenador 100% funcional y ACTUALIZABLE POR

CLAUDE a futuro. Comparador entre modelos, categorías, fichas con

specs/fotos/vídeo, carrito y un checkout SIMULADO (sin pasarela de pago

real). El dueño (yo) podrá decir "cambia esto / sube esto" y tú lo harás

editando el repo y desplegando. Itera hasta que TODOS los criterios de

DEFINICIÓN DE HECHO se cumplan.



\# RESTRICCIONES DURAS (no negociables; el CÓMO es libre)

\- Coste CERO absoluto. Nada de pasarelas de pago, ni claves reales, ni

&#x20; vincular bancos, ni KYC, ni aceptar términos legales de terceros, ni

&#x20; dominios de pago. Si algo lo requiriese, NO lo hagas: usa una

&#x20; alternativa gratuita o simula esa parte.

\- El checkout es una SIMULACIÓN: carrito real, total real, pantalla de

&#x20; "confirmar pedido" que registra la compra y muestra un resumen. Sin

&#x20; cobro real.

\- Arquitectura actualizable por ti: código en repositorio Git propio,

&#x20; deploy automático en hosting gratuito (free tier, sin tarjeta).



\# LIBERTAD DE IMPLEMENTACIÓN

\- Elige TÚ el mejor stack que cumpla las restricciones y justifica

&#x20; brevemente por qué. Evalúa alternativas, no te quedes con la primera.



\# DATOS

\- ≥ 6 ratones con: id, nombre, marca, categoría, specs (dpi, sensor,

&#x20; peso\_g, botones, conexión, polling\_hz), precio\_mercado,

&#x20; precio\_venta = precio\_mercado + 20, imágenes (placeholder o stock

&#x20; libre), vídeo (placeholder o stock libre), descripción.

&#x20; El precio\_venta SIEMPRE se calcula, nunca a mano.



\# DEFINICIÓN DE HECHO (criterio de salida del bucle)

Escribe tests automatizados y no termines hasta que TODOS pasen Y el

build sea verde Y la web esté desplegada en una URL pública accesible:

\- \[ ] Build sin errores, linter limpio.

\- \[ ] Home lista ≥ 6 productos con filtros por categoría funcionando.

\- \[ ] Cada ficha muestra precio = precio\_mercado + 20 (verifica el cálculo).

\- \[ ] Comparador enfrenta ≥ 2 productos mostrando specs lado a lado.

\- \[ ] Añadir al carrito actualiza el total correctamente.

\- \[ ] El checkout simulado completa un pedido y muestra el resumen.

\- \[ ] Proyecto en repo Git propio + desplegado con auto-deploy.

\- \[ ] README que explica cómo TÚ (Claude) actualizas la web a futuro

&#x20;     (editar archivos → push → redeploy).



\# AL TERMINAR

Dame: la URL pública, el enlace del repo, el resumen de qué se hizo y

dónde, y el stack que elegiste con su justificación.

