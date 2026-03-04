# E-commerce Platform — Anthonix

Monorepo with a React frontend and Express + PostgreSQL backend.
Design philosophy: editorial-grade, intentional, never generic.

## Architecture

```
client/              # Frontend — Vite + React 18 + Tailwind CSS 3.4
  src/
    app/             # App shell, providers, router config
    assets/          # Static images, icons, fonts
    components/
      ui/            # Primitives: Button, Input, Badge, Modal, Skeleton
      layout/        # Header, Footer, Sidebar, PageShell, Container
      commerce/      # ProductCard, CartItem, PriceDisplay, Rating
    features/
      products/      # Catalog, PDP, filtering, sorting
      cart/          # Cart state, drawer, line items
      checkout/      # Multi-step checkout flow
      auth/          # Login, register, password reset
      account/       # Profile, order history, addresses
      search/        # Search bar, results, suggestions
    hooks/           # Shared custom hooks
    lib/             # Utilities, API client, constants
    styles/          # Global CSS, Tailwind config extensions

server/              # Backend — Express 5 + Sequelize + PostgreSQL
  index.js           # App entry, middleware, route mounting
  database.js        # Sequelize connection config (env-driven)
  migrations.sql     # Database schema
  controllers/       # Request handlers
    authController.js
    productControllers.js
    cartController.js
    orderController.js
    customerController.js (customer.js)
    adminController.js
    aiAssistantController.js
  models/            # Sequelize models & associations
    Customer.js, CustomerAuth.js
    Product.js
    Cart.js, CartItem.js
    Order.js, OrderItem.js
    index.js         # Model associations
  routes/            # Express route definitions
    authRoutes.js, Products.js, cartRoutes.js
    orderRoutes.js, customerRoutes.js
    adminRoutes.js, aiAssistantRoutes.js
  middleware/        # auth.js (JWT), adminAuth.js
```

Each client feature folder contains: `api.js`, `hooks/`, `components/`, and a page component.

## Server

- **Runtime**: Node.js (CommonJS), Express 5
- **ORM**: Sequelize 6 with PostgreSQL (`pg`)
- **Auth**: JWT (`jsonwebtoken`) + bcrypt password hashing
- **API prefix**: All routes under `/api/` — auth, products, cart, orders, customer, admin, assistant
- **Config**: Environment variables via `dotenv` — `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DIALECT`, `PORT`
- **Models**: Customer → CustomerAuth (1:1), Customer → Cart (1:1), Cart → CartItem (1:N), CartItem → Product (N:1), Customer → Order (1:N), Order → OrderItem (1:N), OrderItem → Product (N:1)

## Code Style

1. Named exports only — no default exports
2. Function declarations for components (`function ProductCard()` not `const ProductCard =`)
3. One component per file, filename matches component name
4. Barrel `index.js` per feature — re-export public API only, not internal components
5. All files use `.jsx` (components) or `.js` (utilities/data) — no TypeScript

## Tailwind & Styling

1. Define custom design tokens in `tailwind.config.js` — ban default palette colors in production components
2. Semantic CSS custom properties for colors: `--color-surface`, `--color-text-primary`, `--color-brand`, etc.
3. 4px spacing rhythm — do not override Tailwind's default spacing scale
4. `@apply` only in `@layer base` for element resets — never in component CSS
5. No arbitrary values (`[13px]`, `[#fa0]`) — extend the config instead
6. Dark mode via `class` strategy
7. Mobile-first: write base styles for mobile, `sm:` / `md:` / `lg:` for larger
8. Use `cn()` utility (clsx + tailwind-merge) for all conditional classNames

## Design Language

### Typography

<!-- CUSTOMIZE: Choose a distinctive display font and a readable body font -->
<!-- Candidates — Display: Playfair Display, Fraunces, DM Serif Display, Clash Display -->
<!-- Candidates — Body: DM Sans, Plus Jakarta Sans, Source Sans 3, Outfit -->

- Display font for headings (h1–h3), body font for everything else
- Headings: tight tracking (`tracking-tight`), semi-bold or bold
- Body: normal tracking, regular weight, `leading-relaxed` for long-form

### Color Palette

<!-- CUSTOMIZE: Define your brand colors and neutral scale -->
<!-- Neutral: 11-step scale (50–950) for backgrounds, borders, text -->
<!-- Brand primary: Main CTA, links, active states -->
<!-- Brand secondary: Accents, highlights, badges -->
<!-- Semantic: success (green), warning (amber), error (red), info (blue) -->

- Map all colors to CSS custom properties in `:root` and `.dark`
- Never use raw hex/rgb in components — always reference tokens
- Ensure WCAG AA contrast on all text/background pairings

### Layout Bans

Do NOT use these patterns — they produce generic, forgettable UI:

- Centered-everything layouts (vary alignment, use asymmetry)
- Uniform border-radius on all elements (vary: sharp for CTAs, gentle for images)
- Generic card grids with equal spacing (use editorial layouts, vary card sizes)
- Purple/violet gradients on white backgrounds
- Inter or system-ui as the only typeface

### Motion

- CSS transitions on interactive elements: 150ms ease for color/opacity, 200ms ease-out for transform
- Staggered entrance animations for lists (50ms delay increment)
- `prefers-reduced-motion: reduce` — disable all non-essential animation
- No animation on page load above the fold (avoid layout shift)

### Image Handling

- Product cards: 4:5 aspect ratio
- Hero banners: 21:9 on desktop, 16:9 on mobile
- Thumbnails: 1:1
- All images in containers with explicit `aspect-ratio` to prevent CLS
- Lazy load below the fold, eager above
- Show low-res placeholder or skeleton during load

## Component Patterns

1. Accept `className` prop, merge with `cn()` — never override internal styles
2. Handle 4 states: loading (skeleton), error (inline message), empty (illustration + CTA), success (data)
3. Wrap page-level components in `<ErrorBoundary>` with fallback UI
4. Forms: react-hook-form + zod schema validation
5. All interactive elements: min 44px touch target

## Data & State

1. Prices stored as integer cents — `{ amount: number, currency: string }`
2. `formatPrice(money)` utility in `lib/format.js`
3. Add TanStack Query / Zustand only when server state or complex client state is needed

## Routing

1. React Router v6 with `createBrowserRouter`
2. All page components loaded via `React.lazy` + `<Suspense>`
3. URL is source of truth for: search query, filters, sort order, pagination
4. `<ProtectedRoute>` wrapper redirects unauthenticated users to `/login?redirect=`
5. Routes: `/`, `/new-releases`, `/products`, `/products/:slug`, `/cart`, `/checkout`, `/login`, `/register`, `/account`, `/account/orders`, `/search`

## Performance

1. Virtualize lists with >50 items (TanStack Virtual)
2. Analyze bundle before deploy — no single chunk >150KB gzipped
3. Preload display font in `<head>` with `font-display: swap`

## Skills

Always load matching skills before starting work:

- `/anthonix-admin` — any admin-facing feature: dashboard, protected routes, admin stats, order/product/customer management, adminAuth, `/api/admin/*` endpoints
- `/anthonix-fullstack` — adding a new full-stack feature end-to-end: new endpoint + page, "build [feature]", "add API and UI for...", any task requiring both Express routes/controllers and a React feature folder
- `/frontend-design` — building or modifying any UI component, layout, or page

If multiple skills match, load all of them. Only skip skills for pure data changes, config edits, or backend-only refactors with no UI impact.

## Token-Saving Rules

1. Do NOT use agents (Task tool) unless the task clearly requires multi-file exploration or parallel sub-tasks — prefer direct Glob, Grep, Read instead
2. Do NOT create task lists (TaskCreate) for simple or single-step changes
3. Keep responses short — no long explanations unless asked
