# The first prompt

Open Claude Code in the project folder and paste everything between the lines.

---

I'm building a Customer Support Dashboard as a frontend job-interview task. It's a 3-hour
timebox, it gets deployed to Vercel, and in the next interview round they will ask me to
explain, debug and modify this code live. So the code has to be something I can defend line by
line — clear over clever, and no patterns I'd struggle to justify.

The full spec is already in this folder. Before writing any code, read all of these:

- `CLAUDE.md` — guardrails, read this first
- `docs/01-PRD.md` — requirements and traceability
- `docs/02-TRD.md` — stack, data model, API layer, store design, folder structure
- `docs/03-ARCHITECTURE.md` — component tree and data flow
- `docs/04-DESIGN-SYSTEM.md` — locked design tokens and component specs
- `docs/05-BUILD-PLAN.md` — the seven phases

`seed/tickets.json` has 12 ready-made tickets with conversation threads. Use it as-is; don't
generate new data.

Then, before touching any files, reply with:

1. A short summary of what you're building, in your own words — so I can check the spec is
   unambiguous.
2. Anything in the docs that is contradictory, underspecified, or that you'd push back on. Be
   direct; it's cheaper to fix a doc now than refactor code in an hour.
3. Your exact plan for Phase 0 only: the commands you'll run and the files you'll create.

Then stop and wait for my go-ahead.

Once I confirm, execute **Phase 0 only**. After it, stop again and tell me: what you added, the
one decision worth knowing about, and what I should click to verify it works. I'll review and
tell you when to start Phase 1.

Two rules for the whole session:

- Never run more than one phase without me asking. I need to read every diff.
- If you're about to add a dependency that isn't in TRD §1, or introduce a colour, radius or
  spacing value that isn't in the design system, stop and ask instead.

---

## What good looks like in its reply

- It should notice things and push back — for example that Tailwind v4 has no
  `tailwind.config.js`, or ask whether you want the panel to be a route or local state.
- It should **not** immediately start scaffolding. If it starts writing files before answering,
  stop it and re-send the last four paragraphs.

If it asks a question you don't know the answer to, the docs almost certainly cover it — search
them rather than guessing, since whatever you decide is what you'll be defending in round 2.
