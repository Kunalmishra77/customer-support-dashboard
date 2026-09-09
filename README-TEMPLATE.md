# Customer Support Dashboard

A support-team dashboard for viewing and managing customer tickets. Built as a technical task.

**Live:** <vercel url>
**Repo:** <github url>

<!-- Add one screenshot of the queue and one of the open detail panel. Two images, no more.
     A GIF of opening a ticket and changing its status is worth more than four stills. -->

## What it does

- Queue summary with total, open, in progress and resolved counts, derived from the data
- Ticket list with customer, subject, priority, status and created date
- Search across customer name, subject and ticket ID
- Filter by status and by priority, combinable with search
- Change a ticket's status inline from the list or from the detail panel
- Detail panel with customer information, the full issue, status and priority, timestamps and
  the conversation history
- Loading, error and empty states, with two distinct empty states for "no tickets" and
  "no results for these filters"
- Responsive: a table on desktop, cards on mobile, and the panel becomes a bottom sheet

## Stack

| | |
|---|---|
| React 18 + TypeScript | |
| Vite | build tool |
| Tailwind CSS v4 | styling, tokens declared in CSS |
| Zustand | ticket data, request state, optimistic mutations |
| React Router | routing and URL-held view state |
| lucide-react | icons |

No component library and no data-fetching library — the primitives and the async handling are
written here on purpose.

## Running it

```bash
git clone <repo-url>
cd customer-support-dashboard
npm install
npm run dev          # http://localhost:5173
```

```bash
npm run build        # type-check and production build
npm run preview      # serve the build locally
```

To see the error state, create `.env.local` with `VITE_FAIL_RATE=1` and restart the dev server.
Every request will then fail, so you can exercise the error UI and the optimistic rollback.

## Data

Tickets are served as a static JSON endpoint at `public/api/tickets.json` and fetched over HTTP
with a small artificial delay, so the loading and error states are real rather than simulated in
a component. All access goes through `src/features/tickets/api/ticketsApi.ts`.

There is no backend, so status updates are applied client-side. `patchTicketStatus` simulates
the network round trip; changes are lost on refresh. See "Limitations" below.

## Structure

```
public/api/tickets.json      the mock endpoint
src/
  app/                       shell and routes
  components/ui/             generic primitives — no ticket knowledge
  features/tickets/
    api/                     fetch layer, error type, delay, failure injection
    store/                   zustand store
    hooks/                   stats, filters, filtered list
    components/              queue, filters, list, row, card, detail panel
  lib/                       constants, date helpers, cn
  types/                     the ticket model
```

## Decisions

**Zustand over Redux.** One async resource and one domain. Redux Toolkit would mean slices,
thunks, a provider and typed hooks for the same behaviour. Zustand is a hook over a plain
object. On a larger app with multiple domains and middleware needs, that trade-off flips.

**Filters and the open ticket live in the URL, not in the store.** Both are view state.
Keeping them in `?q=&status=&priority=` and `/tickets/:id` means reloads keep your place, the
back button undoes a filter, and a filtered view can be shared as a link. Zustand keeps what a
URL can't: the ticket data, request status and mutations.

**A side panel rather than a modal or a separate page.** The queue stays visible behind it,
which matches how a triage tool is actually used, and it's still route-driven so deep links
work. On mobile it becomes a full-height sheet.

**Optimistic status updates.** The UI updates immediately and rolls back with an error toast if
the request fails. Right for an action that's low-risk, reversible and performed constantly.

**Priority carries colour, status stays quiet.** Priority appears as a coloured rule on the left
edge of each row so it's scannable without reading; status is a small neutral dot. Two urgency
scales competing for attention would make both harder to read.

## AI tools used

<!-- The brief asks for this. Be specific and honest — it reads better than a vague line. -->

- **Claude (Claude Code)** — planning documents, scaffolding, and most of the component and
  store implementation, working phase by phase against a spec I wrote first.
- <add any others: Cursor, Copilot, ChatGPT>

I reviewed every file, and the architecture decisions above are mine — the docs in `/docs` were
written before any code and drove the build.

## Limitations

- Status changes aren't persisted, since there's no backend. A refresh resets them.
- Twelve seed tickets. Filtering is client-side and would move server-side with real volume.
- No auth, ticket creation, assignment or reply sending — outside the brief's scope.

## What I'd do next

- Tests around the filter hook and the optimistic rollback path
- Sorting by created date and priority
- Server-side search and pagination once the list grows past a few hundred
- Replying to a ticket, and assignment

## What's remaining

<!-- Delete this section if everything is done. If not, list it plainly — the brief explicitly
     invites this and it reads far better than leaving them to find the gaps. -->
