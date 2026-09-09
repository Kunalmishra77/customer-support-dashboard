# Phase prompts

Send these one at a time, after reviewing the previous phase. Keep each phase's exit criteria
from `docs/05-BUILD-PLAN.md` open while you review.

---

## Phase 1 — Primitives

> Phase 0 looks good. Start Phase 1: types, constants, helpers and the `components/ui`
> primitives, exactly as specified in TRD §5 and the component specs in `04-DESIGN-SYSTEM.md`
> §7.
>
> Build a temporary route at `/kitchen-sink` rendering every primitive in every variant so I can
> eyeball them together. We'll delete it at the end of the phase.
>
> Stop after this phase.

---

## Phase 2 — Data and store

> Primitives approved. Phase 2: the API layer and the Zustand store, plus the three hooks.
>
> Follow TRD §3 and §4 precisely, including the `AbortSignal` on `getTickets`, the
> `VITE_FAIL_RATE` error injection, and the optimistic-with-rollback `updateStatus`.
>
> No UI yet. When you're done, add a temporary `console.log` of tickets and stats in the
> dashboard so I can verify the data flows, and tell me what I should see.
>
> Then walk me through `ticketStore.ts` line by line — I need to be able to explain it in an
> interview.

---

## Phase 3 — The queue

> Store verified. Phase 3: `QueueSummary`, `FilterBar`, `TicketTable` + `TicketRow`,
> `TicketCardList` + `TicketCard`, `TicketList`, and the skeleton, error and empty states.
>
> Watch out for the three things in `CLAUDE.md` that apply here: `stopPropagation` on the inline
> status control, filters written to the URL with `replace`, and skeletons sized to the real
> rows.
>
> Stop after this phase and list what I should test.

---

## Phase 4 — Detail panel

> Queue looks right. Phase 4: the ticket detail panel on route `/tickets/:id`.
>
> Requirements from `01-PRD.md` R11–R16 and the panel spec in `04-DESIGN-SYSTEM.md` §7. Include:
> the not-found state for an unknown id, filters preserved on open and close, Escape and scrim
> to close, focus into the panel on open and back to the row on close, and the mobile bottom
> sheet.
>
> Stop after this phase.

---

## Phase 5 — Polish

> Phase 5: the responsive, accessibility and polish pass from the build plan.
>
> Go through it as an audit and report findings before fixing — I want to see the list of what
> was wrong. Check 375, 768, 1024 and 1440; the full keyboard path; truncation on the longest
> seed ticket; spacing against the 4px scale; and console warnings.
>
> Then fix what you found, and confirm `npm run build` passes clean.

---

## Phase 6 — README and deploy prep

> Phase 6. Fill in `README-TEMPLATE.md` into a real `README.md` at the root. Everything must be
> accurate to what we actually built — no aspirational claims.
>
> Include: what it is, live and repo links (leave placeholders I'll fill), the stack and why,
> setup steps that work from a clean clone, the folder structure, the key decisions
> (Zustand vs Redux, URL state, optimistic updates, panel vs modal), the AI tools I used, known
> limitations, and what I'd do next.
>
> Also create `vercel.json` with the SPA rewrite that excludes `/api/`, and delete the
> `/kitchen-sink` route and any leftover `console.log`s.

---

## Useful mid-build prompts

**When something looks off:**
> Before changing anything, explain what's causing this and give me two options with the
> trade-off between them.

**When you don't follow a file:**
> Walk me through `<file>` line by line as if I'm going to be quizzed on it tomorrow. Flag
> anything a reviewer might reasonably question.

**When it over-engineers:**
> This is more than the brief needs. Simplify it to the smallest version that meets the
> requirement and that I can explain in thirty seconds.

**Near the end:**
> Review the whole codebase against `docs/01-PRD.md` §3 and tell me which requirements are
> unmet, partially met, or met but fragile. Be critical — assume a reviewer is looking for
> reasons to reject this.
