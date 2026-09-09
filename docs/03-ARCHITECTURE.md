# Architecture

## 1. Component tree

```
main.tsx
└── BrowserRouter
    └── App
        └── AppShell                      header, container, <Outlet/>
            └── DashboardPage             route "/" and "/tickets/:id"
                ├── QueueSummary          R1 — stats
                │   └── StatFigure ×4
                ├── FilterBar             R7 R8 R9
                │   ├── SearchInput       debounced
                │   ├── StatusFilter      segmented ≥md, Select <md
                │   ├── PriorityFilter    Select
                │   └── ClearFilters      renders only when a filter is active
                ├── TicketList            switches on store.status
                │   ├── TicketListSkeleton      status = loading
                │   ├── TicketsError            status = error   (+ Retry)
                │   ├── TicketsEmpty            0 results        (2 variants)
                │   ├── TicketTable       ≥768px
                │   │   └── TicketRow ×n
                │   │       └── StatusSelect     inline change, stops propagation
                │   └── TicketCardList    <768px
                │       └── TicketCard ×n
                └── TicketDetailPanel     renders when :id param present
                    ├── PanelHeader       subject, ticket id, close
                    ├── CustomerBlock     R12
                    ├── MetaGrid          R14 R15 + StatusSelect
                    ├── DescriptionBlock  R13
                    └── MessageList       R16
                        └── MessageBubble ×n
```

`TicketDetailPanel` is rendered by `DashboardPage`, not by a separate route element. The route
param decides whether it mounts. This keeps the list mounted underneath, so closing the panel
does not refetch or lose scroll position.

## 2. Data flow

```
                     ┌──────────────────────┐
   mount ───────────▶│  ticketStore.fetch   │──▶ ticketsApi.getTickets()
                     └──────────┬───────────┘         │ fetch /api/tickets.json
                                │                     │
                     status: loading → success/error ◀┘
                                │
                     tickets: Ticket[]
                                │
        ┌───────────────────────┼────────────────────────┐
        ▼                       ▼                        ▼
  useTicketStats()      useFilteredTickets()      find(t => t.id === params.id)
        │                       │  ▲                     │
        ▼                       ▼  │                     ▼
   QueueSummary            TicketList │             TicketDetailPanel
                                      │                  │
                          useTicketFilters()             │
                                      │                  │
                              URL ?q=&status=&priority=  │
                                                         │
   StatusSelect (row or panel) ──▶ store.updateStatus ────┘
        │
        ├─ optimistic patch in state ──▶ every subscriber updates:
        │                                stats, row, panel — all at once
        └─ on API failure: rollback + error toast
```

The thing to notice, and to point out in an interview: changing status from inside the panel
updates the row behind it *and* the counters at the top, with no prop plumbing and no manual
refresh. That falls out of a single source of truth. It is also the easiest thing to demo.

## 3. Route design

| Route | Renders |
|---|---|
| `/` | Dashboard, panel closed |
| `/tickets/:id` | Dashboard + panel open |
| `/tickets/:id` where id is unknown | Panel with a "Ticket not found" state and a back link |
| anything else | Redirect to `/` |

Search params (`?q=`, `?status=`, `?priority=`, `?sort=`) are preserved when opening and closing
the panel. Use `navigate({ pathname, search: location.search })` — losing filters on close is
the classic bug here, and it is very visible.

Opening a ticket is a `push`. Changing a filter is a `replace`, so back does not walk through
every keystroke.

## 4. Render strategy: table vs cards

Two components, not one component with CSS gymnastics.

- `TicketTable` — real `<table>` semantics, shown at `md:` and up. Columns: priority edge,
  customer + subject, status, created, chevron.
- `TicketCardList` — stacked cards below `md:`. Same data, reordered for a narrow column.

Swap with Tailwind visibility (`hidden md:block` / `md:hidden`), sharing the same
`useFilteredTickets()` result. Both render, one is hidden — for 12 rows the cost is nil and the
markup for each stays honest to its medium. If asked why not one responsive component: a table
that reflows into cards via CSS ends up with `<div>`s pretending to be `<td>`s, and loses table
semantics for screen readers on desktop.

## 5. Loading, error, empty — the state machine

```
status = idle     → nothing rendered yet (immediately becomes loading on mount)
status = loading  → TicketListSkeleton: 6 rows matching real row height and column widths
status = error    → TicketsError: what failed + Retry (calls fetchTickets again)
status = success
   ├─ tickets.length === 0        → TicketsEmpty variant "no-tickets"
   ├─ filtered.length === 0       → TicketsEmpty variant "no-results" + Clear filters
   └─ otherwise                   → the list
```

Skeletons must match the real layout's dimensions. A generic grey block that causes a layout
jump when data lands is worse than no skeleton — attention to detail is on the grading list.

QueueSummary shows its own skeleton numbers while loading; it must never flash zeros.

## 6. Reusability boundary

`components/ui` is generic. `<Badge tone="danger">` knows about tones, not about priorities.
`<PriorityTag priority="high">` lives in the feature folder and maps `high → danger`.

That one indirection is what makes the primitives actually reusable, and it is a concrete answer
to "which parts of this would you reuse in another project?"

## 7. Error boundaries

One `ErrorBoundary` around `DashboardPage` catching render-time crashes, with a plain "Something
went wrong" panel and a reload button. Async errors are handled in the store — a boundary will
not catch those. Knowing that distinction is worth 30 seconds of interview credit.
