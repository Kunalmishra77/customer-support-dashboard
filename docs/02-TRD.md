# TRD — Technical Requirements

## 1. Stack

| Concern | Choice | Why this one |
|---|---|---|
| Build tool | Vite | Fastest path to a deployable React app. Zero config on Vercel. |
| Language | TypeScript | Types on the ticket model catch the mistakes that cost time in a 3-hour build. Also a visible code-quality signal. |
| UI | React 18+ (function components, hooks only) | |
| Styling | Tailwind CSS v4 | Required by the brief. |
| State | Zustand v5 | See §4. |
| Routing | react-router-dom v7 | Needed for `/tickets/:id` deep links and URL-driven filters. |
| Icons | lucide-react | Small, tree-shaken, consistent stroke weight. |
| Dates | Native `Intl` + a 15-line `formatRelative` helper | Skip date-fns/dayjs. One helper you wrote beats a dependency you can't explain. |
| Deploy | Vercel | Free, GitHub-connected, instant. |

**Do not add:** a component library (shadcn, MUI, Chakra), a data-fetching library (TanStack
Query), a form library, an animation library. The brief is testing whether *you* can build
primitives and handle async state. Importing a library that does it for you removes the
evidence. Framer Motion in particular is a common over-reach here.

### Install

```bash
npm create vite@latest . -- --template react-ts
npm i zustand react-router-dom lucide-react
npm i -D tailwindcss @tailwindcss/vite
```

`vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
})
```

`src/index.css` starts with `@import "tailwindcss";` followed by the `@theme` block from
`04-DESIGN-SYSTEM.md`. There is no `tailwind.config.js` in v4 — tokens are declared in CSS.
Add `"baseUrl": "."` and the `@/*` path mapping to `tsconfig.app.json` so the alias type-checks.

> If Tailwind v4 gives trouble, fall back to v3 with `npx tailwindcss init -p` and put the same
> tokens under `theme.extend`. Decide in the first 10 minutes; do not burn 40 minutes debugging
> a build tool during a timed task.

## 2. Data model

```ts
export type Priority = 'low' | 'medium' | 'high'
export type Status   = 'open' | 'in_progress' | 'resolved'
export type Channel  = 'email' | 'chat' | 'phone'

export interface Customer {
  id: string
  name: string
  email: string
  company: string
  plan: 'Starter' | 'Growth' | 'Scale'
}

export interface Message {
  id: string
  author: { name: string; role: 'customer' | 'agent' }
  body: string
  sentAt: string          // ISO 8601
}

export interface Ticket {
  id: string              // 'TCK-1042' — human-readable, used in search and URLs
  subject: string
  description: string
  priority: Priority
  status: Status
  channel: Channel
  createdAt: string       // ISO 8601
  updatedAt: string       // ISO 8601
  customer: Customer
  assignee: string | null
  tags: string[]
  messages: Message[]
}
```

Store status and priority as snake_case/lowercase machine values. Map to display labels through
one lookup object in `src/lib/constants.ts`. Never write `"In Progress"` into a comparison —
that is the bug they will plant if they ask you to debug something.

## 3. The API layer

The brief says "mock/public REST API". Use a **real HTTP request to a static JSON endpoint**
you own. It is genuinely a network call (so loading/error handling is real, not theatre), it
works identically in dev and on Vercel, and it needs no server.

- Copy `seed/tickets.json` to `public/api/tickets.json`.
- All access goes through `src/features/tickets/api/ticketsApi.ts`. No component ever calls
  `fetch` directly.

```ts
const BASE = import.meta.env.BASE_URL  // handles subpath deploys

export async function getTickets(signal?: AbortSignal): Promise<Ticket[]> {
  await delay(700)                            // visible loading state
  maybeFail()                                 // dev-only error injection
  const res = await fetch(`${BASE}api/tickets.json`, { signal })
  if (!res.ok) throw new ApiError(`Request failed with ${res.status}`, res.status)
  return (await res.json()) as Ticket[]
}

export async function patchTicketStatus(id: string, status: Status): Promise<{ id: string; status: Status }> {
  await delay(400)
  maybeFail()
  return { id, status }                       // simulated write — no backend to persist to
}
```

Requirements for this module:

- `ApiError` class carrying a `status` field. Throw it, catch it, render it.
- `delay(ms)` — a promise-based sleep. Keep it under 900ms.
- `maybeFail()` — reads `VITE_FAIL_RATE` (default `0`). Set it to `1` in `.env.local` to
  demo the error state. Documented in the README.
- Accept an `AbortSignal` on `getTickets` and abort in the effect cleanup. React 18 StrictMode
  double-invokes effects in dev; without abort you get a duplicate request and a possible
  state-after-unmount warning. **This is a likely round-2 question — know the answer.**
- Be honest in the README: `patchTicketStatus` is simulated, mutations are in-memory, a refresh
  resets them. Stating a limitation reads better than pretending it isn't one.

## 4. State: why Zustand, and what goes where

**Why Zustand over Redux Toolkit:** for a single-domain app with one async resource, RTK's
slices, thunks and store wiring is roughly 4× the code for the same behaviour. Zustand is a
hook over a plain object with no provider. In a 3-hour build, less ceremony means more attention
on UI quality — which is what is being graded.

**The split — this is the design decision to be able to defend:**

| State | Home | Reason |
|---|---|---|
| Tickets, request status, error | Zustand `ticketStore` | Server data, shared, mutated |
| Search text, status filter, priority filter, sort | URL search params | Belongs to the *view*. Shareable, survives reload, back button works. |
| Which ticket is open | URL path `/tickets/:id` | Same reason. Deep-linkable. |
| Toasts | Zustand `uiStore` | Ephemeral, cross-component |

If a reviewer asks "the brief said use Zustand, why is filter state in the URL?" — the answer is
that Zustand *is* used, for the data it is right for. Filters are navigation state; putting them
in a store would mean reimplementing history, sharing and reload persistence by hand. Making
that distinction deliberately is the point.

### Store shape

```ts
interface TicketStore {
  tickets: Ticket[]
  status: 'idle' | 'loading' | 'success' | 'error'
  error: string | null
  fetchTickets: () => Promise<void>
  updateStatus: (id: string, next: Status) => Promise<void>
}
```

`updateStatus` is optimistic:

1. Capture the previous status.
2. Patch it in state immediately (also bump `updatedAt`).
3. `await patchTicketStatus(...)`.
4. On throw: restore the previous status and push an error toast.

### Selector rules

- Always subscribe with a selector: `useTicketStore(s => s.tickets)`. Never
  `useTicketStore()` bare — that subscribes to the whole store and re-renders on every change.
- Never return a new object or array from a selector inline (`s => ({a, b})`), it creates a new
  reference every render and loops. Take one value per hook call, or use `useShallow`.
- Derived data (stats, filtered list) is computed in `useMemo` inside hooks, not stored. Two
  sources of truth for the same number is how counts drift out of sync.

```
useTicketStats()      -> { total, open, in_progress, resolved }
useTicketFilters()    -> { filters, setFilter, clearFilters }   // reads/writes useSearchParams
useFilteredTickets()  -> Ticket[]                               // tickets x filters, memoised
```

Search matches customer name, subject and ticket id, case-insensitive, debounced 250ms. Debounce
the *input value*, not the URL write, or every keystroke becomes a history entry.

## 5. Folder structure

```
public/
  api/tickets.json
src/
  app/
    App.tsx                 routes
    AppShell.tsx            header + layout frame
  components/ui/            Button Badge StatusDot PriorityTag Input Select
                            Skeleton Avatar Panel Toast EmptyState IconButton
  features/tickets/
    api/ticketsApi.ts
    store/ticketStore.ts
    hooks/                  useTicketStats useTicketFilters useFilteredTickets
    components/             QueueSummary FilterBar TicketTable TicketRow
                            TicketCard TicketList TicketDetailPanel
                            StatusSelect MessageList MessageBubble
                            TicketListSkeleton TicketsError TicketsEmpty
  lib/
    cn.ts                   className merge helper
    constants.ts            STATUS / PRIORITY label + style maps
    date.ts                 formatRelative, formatAbsolute
  types/ticket.ts
  index.css
  main.tsx
```

Rules: one component per file, named the same as the file. Feature code stays inside
`features/tickets`. `components/ui` knows nothing about tickets — that is what makes it reusable
rather than just "moved to another folder".

## 6. Quality bar

- No `any`. If a type is hard, ask Claude to explain rather than escape-hatch it.
- Every list has a stable `key` — the ticket id, never the array index.
- Every interactive element is reachable by keyboard and shows a visible focus ring.
- Ticket rows are `<button>` or have `role="button"` + `tabIndex={0}` + Enter/Space handlers.
  A clickable `<div>` with only an `onClick` is an accessibility bug reviewers do notice.
- The panel: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` on the subject, Escape
  closes, focus moves in on open and returns to the trigger on close.
- `prefers-reduced-motion` respected on the panel transition.
- Images/avatars: initials in a coloured circle. No external avatar service — it will be the
  thing that's down during their review.
- `npm run build` must pass with zero TS errors before deploying.

## 7. Performance notes (small app, but be ready to talk about it)

- Filtering 12 tickets needs no optimisation. Say so if asked — premature memoisation is a
  smell, not a virtue.
- Where `useMemo` *is* used, it is because the result feeds a list render, not by reflex.
- The scaling answer, if they push: at ~5,000 rows you move filtering server-side and add
  pagination; virtualisation only if the list must stay client-side.
