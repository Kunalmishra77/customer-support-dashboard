# Round 2 prep

The brief says it outright: they may ask you to explain, debug, or modify the app. Using AI is
fine; not understanding the output is not. Work through this before you submit, while the code
is still fresh.

## 1. The 60-second walkthrough

Practice this out loud once. It sets the frame for everything after it.

> It's a Vite + React + TypeScript app. Zustand holds the ticket data and the request state —
> that's the server data. Filters and the currently open ticket live in the URL instead, because
> they're view state and I wanted reloads, the back button and shared links to work. The list
> and the panel both read from the same store, so changing a status anywhere updates the row and
> the counters at once. The API layer is a real fetch to a static JSON endpoint with a small
> artificial delay, so the loading and error states are genuine rather than faked. Status writes
> are optimistic with a rollback if the request fails. Tailwind, with tokens defined once in
> CSS. Table on desktop, cards on mobile, panel becomes a bottom sheet.

## 2. Questions you should expect

**Why Zustand and not Redux?**
One async resource, one domain. RTK would be roughly four times the code — slices, thunks,
provider, typed hooks — for the same behaviour. Zustand is a hook over a plain object with no
provider. On a larger app with many slices, middleware needs and a big team, RTK's structure
starts paying for itself.

**Why is filter state in the URL and not in the store?**
Filters describe the current view. In the URL they get reload persistence, back-button undo and
shareability for free. In a store I'd have to rebuild all three by hand. Zustand still owns the
tickets, the request status and mutations — the things a URL can't hold.

**Walk me through what happens when I change a ticket's status.**
The select calls `updateStatus(id, next)` on the store. It saves the current status, patches
state immediately so the UI responds without waiting, then awaits the API call. On success it
does nothing more; on failure it restores the old status and pushes an error toast. That's an
optimistic update — right for a low-risk, reversible, high-frequency action. For something like
a payment I'd wait for the server instead.

**Why optimistic and not just wait?**
Agents change status dozens of times an hour. A 400ms spinner on every one of those is a worse
experience than a rare rollback.

**How does the detail panel work?**
It's driven by the route `/tickets/:id`. The dashboard reads the param and renders the panel if
it's present. The list stays mounted underneath, so closing doesn't refetch or lose scroll. Deep
links work, and I carry `location.search` through the navigation so filters survive.

**Why two components for the table and the cards?**
Reflowing a table into cards with CSS ends up as `div`s pretending to be table cells, and you
lose the table semantics on desktop. Two small components sharing one filtered list is simpler
to read and each is honest to its layout. At twelve rows, rendering both and hiding one costs
nothing.

**What's `AbortSignal` doing there?**
React 18 StrictMode mounts, unmounts and remounts effects in development. Without an abort in
the cleanup, the first request stays in flight and can resolve after unmount. Aborting kills the
stale one. It also handles a user navigating away mid-request.

**How would this scale to 10,000 tickets?**
Filtering and searching move to the server, and I'd add pagination or cursor-based loading. The
store would hold a page rather than everything. If the whole set had to stay client-side I'd
virtualise the list. None of that is warranted at twelve rows, and adding it now would be
complexity without a reason.

**What would you do with more time?**
Tests around the filter hook and the rollback path, a real backend for persistence, assignment
and reply-sending, and sorting. Also proper focus management refinements in the panel.

**What are you least happy with?**
Have a real answer ready. Suggested: the status mutation is simulated, so a refresh loses
changes — with a backend I'd persist and reconcile. Naming a genuine weakness reads as
self-awareness. "Nothing" reads as not having looked.

## 3. React fundamentals they might probe

Be able to answer these cold:

- **Keys.** Why `key={ticket.id}` and not the index — with index keys, filtering or reordering
  makes React reuse the wrong DOM nodes and component state ends up attached to the wrong item.
- **`useEffect` deps.** Why the fetch effect has `[]` and why that's safe here (the store action
  is stable). What happens if you leave a changing dep in — infinite loop.
- **Stale closures.** Why the store's `set(state => …)` updater form is used instead of reading
  and setting, when updates can race.
- **Controlled inputs.** The search box is controlled by local state, debounced, then written to
  the URL. Why not write the URL on every keystroke — every character would become a history
  entry.
- **Event bubbling.** Why the inline status select calls `stopPropagation` — otherwise the click
  bubbles to the row and opens the panel.
- **Derived vs stored state.** Why the stats are computed from `tickets` rather than kept as
  four counters. Two sources of truth drift.
- **Re-render behaviour.** Why the selector form `useTicketStore(s => s.tickets)` matters, and
  what happens if a selector returns a fresh object literal every render.

## 4. Debug drills — break it yourself, then fix it

Do these locally, time yourself, then `git checkout` the file. If you have seen the failure once,
you will recognise it under pressure.

1. Change the row key to the array index, then filter the list. Observe the wrong state sticking
   to the wrong row.
2. Remove `stopPropagation` from the inline status select. The panel now opens on every change.
3. Change a status comparison to the display label (`'In Progress'` instead of `'in_progress'`).
   The filter silently returns nothing.
4. Make a selector return `s => ({ tickets: s.tickets })`. Watch the infinite re-render.
5. Set `VITE_FAIL_RATE=1` and confirm the error state, the Retry button, and the rollback toast
   all behave.
6. Drop the `location.search` from the panel's close navigation. Filters vanish on close.

## 5. Modification drills

They may ask you to add something live. Rehearse the shape of each:

- **Add an "Urgent" priority.** Type union → `PRIORITY_META` map → filter options → edge rule
  colour. Four files, and the compiler tells you where. That is the payoff of the constants map.
- **Add a sort by priority.** One comparator in `useFilteredTickets`, one select bound to a
  `?sort=` param.
- **Add an assignee filter.** Same pattern as the status filter, end to end.
- **Show the last message preview in the row.** `ticket.messages.at(-1)?.body`, truncated.
- **Make status changes persist.** Subscribe to the store and mirror to `localStorage`, hydrate
  on load. Be ready to say why you didn't ship it: it pretends to be persistence without being
  it, and a real backend is the right fix.

## 6. Before the call

- Reread `ticketStore.ts`, `useFilteredTickets.ts` and `TicketDetailPanel.tsx` line by line.
  Those three are where the questions will land.
- Have the repo open in your editor, the live site in a tab, and `npm run dev` already running.
- If you don't know something, say so and reason out loud toward an answer. Interviewers rate
  that far higher than a confident wrong answer — and they can tell the difference.
