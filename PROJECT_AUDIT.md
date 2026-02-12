# Auditoría técnica y de producto — Soccer.Camisetas

Fecha: 2026-02-12

## Resumen ejecutivo

El proyecto está bien orientado para **conversión rápida por WhatsApp** y tiene una base simple que facilita iterar. El principal cuello de botella ahora no es "hacer más UI", sino mejorar tres pilares:

1. **Mantenibilidad** (separación de responsabilidades, utilidades compartidas, configuración).
2. **Calidad de datos/activos** (imágenes placeholder y normalización de nombres).
3. **Crecimiento comercial** (SEO técnico, analítica, trazabilidad del funnel).

---

## Fortalezas actuales

- Arquitectura liviana con React + Vite, ideal para carga rápida y despliegue simple.
- CTA de WhatsApp visible en múltiples puntos de la interfaz.
- Catálogo navegable por liga → equipo → camiseta con búsqueda integrada.
- Estilo consistente gracias a variables CSS globales.

---

## Mejoras recomendadas (priorizadas)

## P0 — Crítico (hacer primero)

### 1) Resolver error de lint y asegurar CI mínima
- Estado actual: `npm run lint` falla por `no-useless-escape` en la regex de `Catalog.jsx`.
- Impacto: impide tener una puerta mínima de calidad antes de desplegar.
- Recomendación:
  - Corregir la regex.
  - Añadir un workflow simple (GitHub Actions) con `npm ci`, `npm run lint`, `npm run build`.

### 2) Eliminar imágenes placeholder del catálogo
- Estado actual: hay múltiples productos con `https://placehold.co/...`.
- Impacto: reduce confianza y conversión; se percibe incompleto.
- Recomendación:
  - Completar imágenes reales o marcar productos como “Próximamente”.
  - Añadir un script de validación que falle si quedan placeholders en producción.

### 3) Centralizar configuración comercial (WhatsApp, envío, mensajes)
- Estado actual: el número y copys se repiten en varios componentes.
- Impacto: riesgo alto de inconsistencias al cambiar datos comerciales.
- Recomendación:
  - Crear `src/config/store.js` con `WHATSAPP_NUMBER`, `DEFAULT_MESSAGE`, `SHIPPING_COPY`.
  - Consumir esa config desde Header, cards, modal y footer.

---

## P1 — Alto impacto (siguiente iteración)

### 4) Separar lógica de dominio del componente `Catalog`
- Estado actual: `Catalog.jsx` concentra render, estado y derivaciones de datos.
- Impacto: difícil de testear y de escalar (filtros, orden, paginado, stock, etc.).
- Recomendación:
  - Crear utilidades en `src/features/catalog/`:
    - `selectors.js` (ligas, equipos, filtrados)
    - `normalizers.js` (normalización de strings para imágenes)
  - Usar `useMemo` para cálculos derivados (`filtered`, `leagueProducts`, `teamsInLeague`, etc.).

### 5) Mejorar accesibilidad e interacción por teclado
- Estado actual:
  - Tarjeta clicable con `div` (`ProductCard`) en vez de elemento semántico interactivo.
  - Modal sin gestión completa de foco (solo ESC + bloqueo de scroll).
- Impacto: UX inferior para teclado/lectores de pantalla y cumplimiento A11y limitado.
- Recomendación:
  - Cambiar tarjeta a `<button>` o `<article>` + botón explícito de “Vista rápida”.
  - En modal: foco inicial en cerrar, trap de foco, `aria-modal="true"`, `role="dialog"`.

### 6) Consolidar assets y fallback de escudos
- Estado actual: `getBadgePath` infiere ruta a partir del nombre y puede romper con tildes/puntuación.
- Impacto: imágenes rotas silenciosas.
- Recomendación:
  - Definir mapa explícito `team -> shieldPath` generado offline.
  - Añadir `onError` para fallback visual.

---

## P2 — Escalabilidad / negocio

### 7) Añadir SEO estructurado para catálogo
- Implementar JSON-LD (`Organization`, `Product`, `ItemList`) y Open Graph dinámico.
- Crear páginas indexables por liga/equipo (aunque sea SPA con pre-render).

### 8) Analítica de funnel
- Medir eventos clave: búsqueda, selección de liga/equipo, apertura modal, click en WhatsApp.
- KPI base: CTR a WhatsApp, tasa por liga, productos más solicitados.

### 9) Preparar i18n y contenido editable
- Extraer textos UI a archivos de copy (`src/content/es.json`).
- Facilitar pruebas de mensajes sin tocar componentes.

### 10) Estrategia de datos
- Migrar `products.json` a fuente gestionable (CMS ligero, Airtable, Supabase o JSON remoto versionado).
- Añadir campos `price`, `stock`, `isNew`, `isFeatured`, `updatedAt`.

---

## Propuesta de estructura futura

```txt
src/
  app/
    App.jsx
    providers/
  config/
    store.js
  features/
    catalog/
      components/
      hooks/
      selectors.js
      normalizers.js
    checkout/
      whatsapp.js
  shared/
    components/
    icons/
    utils/
  content/
    es.json
  data/
    products.json
```

---

## Plan sugerido por sprints

### Sprint 1 (rápido, 1-2 días)
- Corregir lint y activar CI.
- Centralizar configuración comercial.
- Limpiar placeholders prioritarios.

### Sprint 2 (2-4 días)
- Refactor de `Catalog` + utilidades + `useMemo`.
- Mejoras A11y en tarjetas y modal.

### Sprint 3 (3-5 días)
- Analítica de funnel.
- SEO estructurado y páginas de aterrizaje por liga.

---

## Checklist de calidad recomendado

- [ ] `npm run lint` sin errores.
- [ ] `npm run build` estable.
- [ ] Sin imágenes placeholder en producción.
- [ ] Todas las acciones críticas con tracking de analítica.
- [ ] Modal accesible (teclado + lector).
- [ ] Config comercial centralizada y sin hardcodes duplicados.

