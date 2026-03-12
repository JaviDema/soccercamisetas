# CLAUDE.md - Soccer.Camisetas

## Project Overview

Football jersey e-commerce catalog built with React 19 + Vite. Displays Thai AAA+ quality replica shirts organized by leagues and teams. No backend — product data lives in a JSON file and sales happen via Instagram DMs.

**Live site:** https://soccer-camisetas-web.vercel.app/
**Language:** Spanish (UI text, product data, HTML lang="es")

## Tech Stack

- **React 19** (functional components, hooks)
- **Vite 7** (build tool, dev server)
- **JavaScript/JSX** (no TypeScript)
- **Plain CSS** (no preprocessors, no Tailwind)
- **Vercel** (deployment, auto-deploys from main)

## Commands

```bash
npm run dev       # Start dev server at localhost:5173
npm run build     # Production build to dist/
npm run lint      # ESLint (flat config, ESLint 9)
npm run preview   # Preview production build locally
```

There are no tests configured.

## Project Structure

```
src/
  components/       # React components (Catalog, ProductCard, Header, QuickView, InfoSection, Icons)
  data/
    products.json   # Product database (~636 products)
  utils/
    catalog.js      # Product normalization, deduplication, filtering logic
  assets/           # Media assets
  App.jsx           # Root component
  main.jsx          # Entry point
  index.css         # Global styles + CSS variables (928 lines)
  App.css           # Minimal app-level overrides
public/
  images/
    escudos/        # Team badges and league logos
    products/       # Product images (2000+ files)
scripts/            # Python/JS automation scripts for catalog management
docs/               # Spanish-language update docs
```

## Architecture & Data Flow

1. `products.json` contains all product data (no API calls)
2. `src/utils/catalog.js` normalizes and deduplicates products at load time
3. `Catalog.jsx` handles filtering (league, type, search) — all client-side
4. `ProductCard.jsx` renders individual items; `QuickView.jsx` shows modal details
5. Sales CTAs link to Instagram (`https://instagram.com/soccer.camisetas1`)

## Code Conventions

- **Components:** PascalCase, functional with hooks, one per file
- **Functions/variables:** camelCase
- **Constants:** UPPER_SNAKE_CASE (e.g., `INSTAGRAM_URL`, `TYPE_FILTERS`, `LEAGUE_ORDER`)
- **CSS:** BEM-style class names (e.g., `product-card`, `modal-content`, `badge-home`)
- **State:** Local `useState` only — no Redux, no Context API
- **Performance:** `useMemo` for filtered lists, `loading="lazy"` on images
- **Accessibility:** ARIA labels, semantic HTML, keyboard support (Escape closes modals), focus management with `useRef`

## ESLint Configuration

- Flat config format (ESLint 9)
- Extends: `@eslint/js` recommended, `react-hooks`, `react-refresh`
- `no-unused-vars` ignores variables starting with uppercase or underscore (`varsIgnorePattern: '^[A-Z_]'`)
- Ignores `dist/` directory
- Target: ECMAScript 2020, browser globals, JSX enabled

## Product Data Schema

Each entry in `products.json`:

```json
{
  "id": 1001,
  "league": "La Liga",
  "team": "Real Madrid",
  "type": "Home 25/26",
  "image": "/images/products/1001_Real_Madrid_HOME_2526.jpg",
  "price": 25
}
```

- `price` is optional (defaults to 15 in the UI)
- `type` values include: home, away, third, kids (niño/niña), retro, player versions
- Leagues: Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Selecciones, Retro, Otras Ligas

## CSS Design System

Key CSS variables defined in `index.css`:

- `--primary: #111827` (dark gray)
- `--instagram: #E1306C` (brand pink)
- Badge colors: niño (#10B981 green), retro (#8B5CF6 purple), player (#3B82F6 blue)
- Mobile-first responsive design with fluid units (`clamp`, `vw`, `%`)
- Sticky header with backdrop blur, sticky filter bar

## Important Notes

- No `.env` files or secrets — all config is compile-time
- No backend or API — fully static site
- Images split between local (`/images/products/`) and CDN URLs
- Automation scripts in `scripts/` are for one-off catalog management (Python + Node)
- No Prettier or pre-commit hooks configured
- README.md is essentially empty
