# Build plan

Seven phases, ~2h50m of build time. Each has an exit criterion — do not start the next phase
until the current one passes. Commit at every phase boundary with a real message.

Track progress by ticking these boxes as you go. If you run out of time, whatever is unticked
goes into the README's "What's remaining" section.

---

## Phase 0 — Scaffold (15 min)

- [ ] Vite + React + TS project created in the folder
- [ ] Tailwind v4 wired via `@tailwindcss/vite`, `@theme` block from the design system pasted in
- [ ] `@/*` alias working in both `vite.config.ts` and `tsconfig.app.json`
- [ ] IBM Plex Sans linked in `index.html`
- [ ] `seed/tickets.json` copied to `public/api/tickets.json`
- [ ] Router mounted, `/` renders an `AppShell` with the header
- [ ] `.gitignore`, first commit

**Exit:** `npm run dev` shows the header on the grey canvas in the right typeface. A stray
`bg-canvas` class actually applies — if it doesn't, the Tailwind wiring is wrong, fix it now.

**Timebox alarm:** if Tailwind v4 isn't working by minute 12, switch to v3. Do not negotiate.

---

## Phase 1 — Types, tokens, primitives (25 min)

- [ ] `src/types/ticket.ts` — the model from TRD §2
- [ ] `src/lib/constants.ts` — `STATUS_META` and `PRIORITY_META` maps (label + colour classes)
- [ ] `src/lib/cn.ts`, `src/lib/date.ts` (`formatRelative`, `formatAbsolute`)
- [ ] `components/ui`: `Button`, `Input`, `Select`, `Badge`, `StatusDot`, `Avatar`, `Skeleton`,
      `EmptyState`, `IconButton`
- [ ] A scratch route or story page rendering every primitive in every variant

**Exit:** every primitive renders correctly and matches the design tokens. Delete the scratch
page. Building primitives first is what stops the app drifting into inconsistent one-off styles
later — that consistency is a large part of "attention to detail".

---

## Phase 2 — Data layer and store (20 min)

- [ ] `features/tickets/api/ticketsApi.ts` — `getTickets`, `patchTicketStatus`, `ApiError`,
      `delay`, `maybeFail` reading `VITE_FAIL_RATE`
- [ ] `features/tickets/store/ticketStore.ts` — state, `fetchTickets`, optimistic `updateStatus`
      with rollback
- [ ] `hooks/useTicketStats.ts`
- [ ] `hooks/useTicketFilters.ts` — reads/writes `useSearchParams`, 250ms debounce on search
- [ ] `hooks/useFilteredTickets.ts` — memoised filter + sort
- [ ] Fetch fires once on mount with `AbortSignal` cleanup (verify in the Network tab under
      StrictMode: you should not see a stale duplicate response applied)

**Exit:** `console.log` the store in the dashboard and see 12 tickets and correct stats. No
UI yet.

---

## Phase 3 — The queue (45 min)

- [ ] `QueueSummary` with the proportion bar, skeleton figures while loading
- [ ] `FilterBar` — search, status segmented control (select on mobile), priority select,
      conditional Clear filters
- [ ] `TicketTable` + `TicketRow` for ≥md, with the priority edge rule and inline `StatusSelect`
- [ ] `TicketCardList` + `TicketCard` for <md
- [ ] `TicketList` switching on store status
- [ ] `TicketListSkeleton`, `TicketsError` with Retry, `TicketsEmpty` with both variants

**Exit:** search, both filters, and inline status change all work; stats update live when you
change a status; filters persist across a page reload because they are in the URL.

---

## Phase 4 — Ticket detail panel (30 min)

- [ ] Route `/tickets/:id` opens the panel; `/` closes it; filters survive both
- [ ] `TicketDetailPanel`: header, `CustomerBlock`, `MetaGrid` with editable status,
      description, `MessageList`
- [ ] Unknown id → "Ticket not found" state with a back link
- [ ] Mobile: full-height bottom sheet
- [ ] Escape closes, scrim click closes, focus moves in and returns to the trigger row

**Exit:** open a ticket, copy the URL, paste it in a new tab — the app loads with that ticket
open. Change status inside the panel and watch the row and the counters update behind it.

---

## Phase 5 — Responsive, a11y and polish pass (25 min)

- [ ] 375 / 768 / 1024 / 1440 in devtools — no horizontal scroll, no overlap, no cramped text
- [ ] Full keyboard pass: tab order sane, focus visible everywhere, Enter opens a row
- [ ] Truncation on long subjects and emails; check the longest seed ticket
- [ ] Hover, focus and active states on every interactive element
- [ ] Spacing audit against the 4px scale — this is where "attention to detail" is won or lost
- [ ] Zero console errors and zero React warnings
- [ ] `npm run build` passes with no TS errors

**Exit:** the self-check list at the end of `04-DESIGN-SYSTEM.md` passes.

---

## Phase 6 — README and deploy (20 min)

- [ ] Fill in `README-TEMPLATE.md` → `README.md` (AI tools section is required by the brief)
- [ ] `vercel.json` with the SPA rewrite that excludes `/api/`
- [ ] Push to a public GitHub repo with a clean commit history
- [ ] Import to Vercel, deploy, open the live URL on your actual phone
- [ ] Test a deep link to a ticket on the deployed build

**Exit:** the checklist at the end of `06-DEPLOYMENT.md` is fully ticked.

---

## Phase 7 — Only if time remains (optional)

In order of value for this specific brief:

1. **Three Vitest tests** on `useFilteredTickets` and the store's rollback path. High signal for
   "code quality", ~20 min.
2. **Sort control** (newest / oldest / priority). ~10 min, genuinely useful in a queue tool.
3. **`localStorage` persistence** of status changes so a refresh keeps them. ~10 min. Document
   it honestly as a workaround for having no backend.
4. Dark mode. Low value here — nobody grades a support console on dark mode, and a bad one
   hurts more than none.

Do not start any of these before Phase 6 is finished and deployed. A live link is worth more
than a test suite in a folder.

---

## Time budget

| Phase | Box | Running |
|---|---|---|
| 0 Scaffold | 15m | 0:15 |
| 1 Primitives | 25m | 0:40 |
| 2 Data + store | 20m | 1:00 |
| 3 Queue | 45m | 1:45 |
| 4 Detail panel | 30m | 2:15 |
| 5 Polish | 25m | 2:40 |
| 6 README + deploy | 20m | 3:00 |

If you fall behind, cut in this order: sort control, the proportion bar in QueueSummary, the
mobile card layout refinements. Never cut: error/empty states, the detail panel, responsiveness.
