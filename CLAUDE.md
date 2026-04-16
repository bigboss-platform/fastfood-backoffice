# FastFood Back Office — Claude Context

## Current Task
Check `docs/fastfood/tasks/INDEX.md` in the `bigboss` repo for current task status.  
Task files live at `docs/fastfood/tasks/TASK-XX-[STATUS]-name.md`.

## What This Is
Next.js 15 back office app for FastFood tenant admins and staff.  
Used by kitchen staff (chef view), front-of-house (order management), and the business owner (menu, settings, dashboard).  
Auth is email + password (not OTP — that's for end users).

## Stack
- Next.js 15 (App Router), TypeScript strict, CSS Modules only
- No UI component libraries, no animation libraries (pure CSS only)
- Vitest + React Testing Library (unit), Playwright (E2E against staging only)
- Dev Container — open in VS Code and reopen in container

## Project Structure
```
app/
  (auth)/
    login/page.tsx
  (dashboard)/
    layout.tsx         — protected layout, redirects if not authenticated
    dashboard/page.tsx
    orders/page.tsx
    chef/page.tsx
    menus/page.tsx
    analytics/page.tsx
    settings/page.tsx
  globals.css
  layout.tsx
feature/
  auth/               — login container, useAdminSession hook, auth service
  dashboard/          — stat cards, dashboard service
  orders/             — order list, order detail, status controls, payment form
  chef-view/          — chef board, order cards
  menus/              — menu manager, section/item CRUD, photo upload
  analytics/          — placeholder (future)
  settings/           — business info, delivery config, payment instructions, theme editor
  shared/             — sidebar, dashboard layout, api client, toast
tests/
  unit/               — mirrors feature/ folder structure
  e2e/                — Playwright specs (run against staging only)
```

## Feature Folder File Naming
`{descriptive-name}.{folder-name-singular}.{extension}`

Examples:
- `order-card.component.tsx` (inside `components/`)
- `use-order-list.hook.ts` (inside `hooks/`)
- `order.service.ts` (inside `services/`)
- `order-status.enum.ts` (inside `enums/`)
- `order.constant.ts` (inside `constants/`)
- `order.interface.ts` (inside `interfaces/`)
- `order-list.style.module.css` (inside `styles/`)

## Hard Rules — Never Break These

### TypeScript
- `strict: true` — no exceptions
- Never use `null` — use `undefined` only at external boundaries, never as business state
- Never use `any` — type everything explicitly
- Never use non-null assertion `!`
- Use `EMPTY_X` constants as the canonical empty state for every interface

### Empty Object Pattern
Every interface must have a matching `EMPTY_X` constant:
```typescript
// interfaces/order.interface.ts
export interface IOrder { id: string; status: OrderStatus; ... }

// constants/order.constant.ts
export const EMPTY_ORDER: IOrder = { id: "", status: OrderStatus.PENDING, ... }
```

### No Comments
- No inline comments, no block comments, no JSDoc

### Exports
- Named exports only inside `feature/`
- `app/` directory files may use default exports (Next.js requirement)

### CSS
- CSS Modules only — no Tailwind, no inline styles
- Design tokens via `var(--token-name)` — same token set as fastfood-app
- Mobile-first: base styles mobile, `@media (min-width: 768px)` for desktop
- Sidebar: horizontal scrollable nav on mobile, sticky vertical on desktop

### Services
- All services in `feature/*/services/` call the backend API
- Services NEVER throw — return `EMPTY_X` on failure
- All authenticated calls go through `feature/shared/lib/api-client.ts` (fetch wrapper that handles 401 + token refresh)
- Map camelCase → snake_case when sending to API

### State That Lives in localStorage
- `bb_admin_access_token`
- `bb_admin_refresh_token`
- `bb_admin_profile` (JSON)

### Polling Intervals
- Orders list and chef board: every 10 seconds (`ORDER_POLL_INTERVAL_MS = 10000`)
- Dashboard stats: every 60 seconds
- Polling stops when component unmounts (cleanup in `useEffect` return)

### data-testid
Every interactive element and major container must have `data-testid`.

## Key Constants
```typescript
ORDER_POLL_INTERVAL_MS = 10000

ORDER_STATUS_DISPLAY = {
  pending: "Recibido",
  confirmed: "Confirmado",
  preparing: "Preparando",
  ready: "Listo",
  delivered: "Entregado",
  cancelled: "Cancelado",
}

PAYMENT_STATUS_DISPLAY = {
  pending: "Pendiente",
  partially_paid: "Pago parcial",
  paid: "Pagado",
  waived: "Sin cobro",
}
```

## Terminology
- `Tenant Admin` — the person logged into the back office
- `End User` — the customer who placed the order (never "customer" alone in code)
- `Tenant` — the business
- All UI labels in Spanish

## Route Protection
- `app/middleware.ts` guards all `/(dashboard)` routes
- Unauthenticated → redirect to `/login`
- Authenticated on `/login` → redirect to `/dashboard`

## Running Things (inside Dev Container)
```bash
pnpm dev              # start on :3002
pnpm type-check       # TypeScript check
pnpm lint             # ESLint
pnpm test:unit        # Vitest unit tests
pnpm test:unit --run  # single run (no watch)
```

## Forbidden Patterns
- `null` as a value — use `EMPTY_X`
- `any` type
- `export default` inside `feature/`
- Inline styles
- Comments in code
- `console.log`
- Throwing from service functions
- Direct `fetch()` in components — use the api-client or services
- Animation libraries
- Non-null assertion `!`
