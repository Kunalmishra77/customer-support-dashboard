# CLAUDE.md — project guardrails

## What this is

A Customer Support Dashboard built as a job-interview task. React + TypeScript + Vite +
Tailwind v4 + Zustand. Timebox is 3 hours. It gets deployed to Vercel and reviewed by a
hiring team, who will then ask the author to explain, debug and modify the code live.

**That last part is the constraint that matters.** Every line must be something a mid-level
React developer can explain in thirty seconds. Clever beats nothing here; clear beats clever.

## Read before writing code

- `docs/01-PRD.md` — requirements and the traceability table
- `docs/02-TRD.md` — stack, data model, API layer, store design, folder structure
- `docs/03-ARCHITECTURE.md` — component tree and data flow
- `docs/04-DESIGN-SYSTEM.md` — locked tokens and component specs
- `docs/05-BUILD-PLAN.md` — the phases

These are the spec. If something in them looks wrong, say so and ask — do not silently deviate.

## Rules

**Work phase by phase.** Complete one phase from `05-BUILD-PLAN.md`, stop, and report what you
did and what to verify. Do not run ahead into the next phase without being asked. The author
needs to read every diff.

**No new dependencies** beyond those listed in TRD §1 without asking first. Specifically no
component library, no TanStack Query, no date library, no animation library, no form library.

**No `any`.** No `@ts-ignore`. If a type is awkward, explain the problem rather than suppressing it.

**Design tokens are locked.** Use the `@theme` values from `04-DESIGN-SYSTEM.md`. Do not
introduce new hex values, new radii, or spacing off the 4px scale.

**One component per file**, named the same as the file. Feature code under
`src/features/tickets/`. `src/components/ui/` must not import anything ticket-specific.

**Comment sparingly and only for non-obvious decisions** — the optimistic rollback, the abort
signal, the debounce. No comments restating what the line does.

**Explain as you go.** After each phase, list in two or three lines: what was added, the one
decision worth knowing about, and what the author should click to verify it.

## Things that are easy to get wrong here

- Status and priority are stored as machine values (`in_progress`, `high`). Display labels come
  from `src/lib/constants.ts`. Never compare against a display string.
- The inline status control inside a ticket row must `stopPropagation` so it doesn't open the
  detail panel.
- Navigating to and from `/tickets/:id` must preserve `location.search` or the filters are lost.
- Filter writes to the URL use `replace`, opening a ticket uses `push`.
- List keys are ticket ids, never array indices.
- Zustand selectors take one value each and never return a fresh object literal.
- `getTickets` takes an `AbortSignal` and the effect aborts on cleanup.
- The Vercel rewrite must exclude `/api/` or the JSON fetch returns HTML.
- Skeletons must match the real layout's dimensions so nothing jumps when data lands.

## Definition of done for any phase

- `npm run build` passes with zero TypeScript errors
- No console errors or React warnings in the browser
- Keyboard reachable with a visible focus ring
- Renders correctly at 375px and 1440px
