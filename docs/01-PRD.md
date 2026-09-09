# PRD — Customer Support Dashboard

## 1. Context

A support team at **Ledgerly**, a subscription billing SaaS, handles inbound customer tickets.
Agents work the queue all day: they scan for what needs attention, open a ticket, read the
conversation, and move it along.

Why a fictional product rather than generic "Customer 1 / Issue 1" data: the reviewers will
read the seed data. Coherent tickets about failed invoices, API keys and refunds make the
interface look considered. Placeholder noise makes it look unfinished.

## 2. Primary user and job

**User:** a support agent, 8 hours a day in this screen, on a laptop, occasionally on a phone.
**Job:** triage. Find the tickets that need action now, act on them, move on.

Everything follows from that. The list view is optimised for **scanning**, not for looking
pretty in a screenshot. Priority is visible at a glance without reading. Status changes take
one interaction, not three.

## 3. Requirement traceability

Every line of the task PDF, mapped to what gets built. Nothing is dropped.

| # | Requirement (from PDF) | Implementation | Priority |
|---|---|---|---|
| R1 | Stats: Total, Open, In Progress, Resolved | `QueueSummary` strip, derived from store — never hardcoded | Must |
| R2 | Ticket shows customer name | `TicketRow` / `TicketCard` primary column | Must |
| R3 | Ticket shows issue/subject | Primary column, truncated with `title` attr | Must |
| R4 | Priority: Low / Medium / High | Left edge rule + `PriorityTag` | Must |
| R5 | Status: Open / In Progress / Resolved | `StatusDot` + label | Must |
| R6 | Created date | Relative ("2h ago") with absolute in `title` | Must |
| R7 | Search tickets | Debounced, matches customer, subject, ticket ID | Must |
| R8 | Filter by status | Segmented control (desktop) / select (mobile) | Must |
| R9 | Filter by priority | Select | Must |
| R10 | Change ticket status | Inline in row **and** in detail panel; optimistic | Must |
| R11 | Open ticket to see full details | Route-driven side panel `/tickets/:id` | Must |
| R12 | Detail: customer information | Name, email, company, plan, avatar initials | Must |
| R13 | Detail: issue details | Subject + full description | Must |
| R14 | Detail: current status and priority | Meta grid, status editable in place | Must |
| R15 | Detail: date/time | Created + last updated, absolute format | Must |
| R16 | Detail: previous messages/conversation | Threaded `MessageList`, customer vs agent | Must |
| R17 | Zustand or Redux | **Zustand** — see TRD §4 for the reasoning | Must |
| R18 | Fetch from mock/public REST API | Real `fetch()` over HTTP to a static JSON endpoint | Must |
| R19 | Loading state | Skeleton rows matching final layout | Must |
| R20 | Error state | Message + working Retry | Must |
| R21 | Empty state | Two variants: no data vs no results | Must |
| R22 | Tailwind CSS | Tailwind v4, tokens in CSS | Must |
| R23 | Works on desktop and mobile | Table ≥768px, cards below; panel becomes sheet | Must |
| R24 | Reusable components | `components/ui` primitives, used everywhere | Must |
| R25 | GitHub repo + live link + README | See `06-DEPLOYMENT.md` | Must |
| R26 | README names AI tools used | Dedicated section | Must |

## 4. Decisions worth stating

**Detail view = side panel, not a modal or a separate page.**
The PDF leaves this open. A panel keeps the queue visible behind it, which matches how agents
actually work — you check the next ticket while finishing the current one. It is still driven
by a real route (`/tickets/TCK-1042`), so deep links and browser back work, and on mobile it
becomes a full-height sheet. This is the single strongest "UI/UX thinking" signal in the build,
and it costs almost nothing extra.

**Filters live in the URL, ticket data lives in Zustand.**
Filter state is `?q=refund&status=open` in the address bar. Reload keeps your filters, back
button undoes them, and you can send a filtered view to a colleague. Zustand holds server data
and mutations. Two kinds of state, two homes. Be ready to defend this — it is the most likely
"why did you do it this way" question. Answer in TRD §4.

**Status change is optimistic.**
UI updates immediately, request fires, failure rolls back and shows a toast. On a queue tool
this is the correct trade-off: the action is low-risk and reversible, and agents change status
dozens of times an hour.

**Priority is the loud thing; status is quiet.**
Two competing urgency scales in one row makes both unreadable. Priority gets colour (a red or
amber edge rule). Status gets a small neutral dot. See `04-DESIGN-SYSTEM.md`.

## 5. Copy rules

- Sentence case everywhere. No ALL-CAPS labels.
- Buttons say what happens: "Retry", "Clear filters", "Mark resolved".
- Errors state what broke and what to do: "Couldn't load tickets. Check your connection and
  try again." No apologies, no vagueness.
- Empty states point at an action: "No tickets match these filters." + Clear filters button.

## 6. Explicitly out of scope

Auth, ticket creation, assignment, real backend persistence, notifications, dark mode,
i18n, pagination. If asked, the answer is: 3-hour box, and none of these were in the brief.
List them under "What I'd do next" in the README — that reads as judgement, not as a gap.

## 7. Definition of done

- [ ] Every row in §3 verified in the deployed build, not just locally
- [ ] Works at 375px, 768px, 1440px
- [ ] Loading / error / empty all reachable and screenshot-able (see TRD §6 for the dev toggles)
- [ ] Keyboard: tab to a row, Enter opens, Escape closes, focus returns to the row
- [ ] No console errors or warnings
- [ ] README complete, live link works, deep link to a ticket works
