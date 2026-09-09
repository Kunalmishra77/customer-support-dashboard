# Start here — Customer Support Dashboard (interview task)

This folder is the complete planning pack for the frontend task. Drop the whole thing into
your empty project folder, then follow the workflow below.

## What the reviewers actually grade

From the task PDF, in their words: React fundamentals, code quality, responsiveness, UI/UX
thinking, attention to detail, and **your understanding of the code**. Round 2 is them asking
you to explain, debug, or modify the app live.

That last point drives every decision in this pack. Nothing here is clever for its own sake.
Every pattern is one you can defend out loud in 30 seconds.

## Files in this pack

| File | What it's for |
|---|---|
| `START-HERE.md` | This file. Workflow and order of operations. |
| `CLAUDE.md` | Guardrails for Claude Code. Keep at project root — it is read automatically. |
| `docs/01-PRD.md` | What gets built and why. Requirement traceability against the PDF. |
| `docs/02-TRD.md` | Stack, versions, data contract, state design, folder structure. |
| `docs/03-ARCHITECTURE.md` | Component tree, data flow, rendering strategy. |
| `docs/04-DESIGN-SYSTEM.md` | Palette, type, spacing, component specs. Locked tokens. |
| `docs/05-BUILD-PLAN.md` | Seven phases with time boxes and exit criteria. |
| `docs/06-DEPLOYMENT.md` | Vercel deploy, SPA rewrite gotcha, submission checklist. |
| `docs/07-INTERVIEW-PREP.md` | The round-2 cheat sheet. Read this before you submit. |
| `prompts/01-kickoff.md` | **The first prompt to give Claude Code.** |
| `prompts/02-phase-prompts.md` | Follow-up prompts for each build phase. |
| `seed/tickets.json` | 12 ready-made tickets with conversation threads. Saves you 30 minutes. |
| `README-TEMPLATE.md` | Fill-in README for the repo, including the AI-usage disclosure they ask for. |

## Workflow

**Step 1 — Set up the folder (5 min)**

```bash
mkdir support-dashboard && cd support-dashboard
git init
# copy this pack in, so you end up with:
#   support-dashboard/CLAUDE.md
#   support-dashboard/docs/...
#   support-dashboard/prompts/...
#   support-dashboard/seed/tickets.json
```

**Step 2 — Read `docs/01-PRD.md` and `docs/04-DESIGN-SYSTEM.md` yourself (10 min)**

Not optional. If you have not read these, you cannot defend the app in round 2. Change
anything you disagree with *before* Claude starts — it is far cheaper to edit a doc than to
refactor generated code.

**Step 3 — Open Claude Code in the folder and paste `prompts/01-kickoff.md` (2 min)**

It will read the docs, scaffold the project, and stop for your confirmation before building
features. Do not let it run all seven phases in one shot — you will not understand the result.

**Step 4 — Build phase by phase (~2.5 hrs)**

Use `prompts/02-phase-prompts.md`. After each phase: run the app, click through it, read the
diff. If a file confuses you, ask Claude to explain it before moving on. That reading time
*is* the interview prep.

**Step 5 — Deploy and submit (25 min)**

Follow `docs/06-DEPLOYMENT.md`. Do not skip the `vercel.json` step — deep links to
`/tickets/:id` 404 without it, and that is exactly the kind of detail they check.

**Step 6 — Final pass (20 min)**

Run the checklist at the end of `docs/06-DEPLOYMENT.md`, then read `docs/07-INTERVIEW-PREP.md`.

## Scope discipline

They asked for 2–3 hours of work and explicitly said partial submissions are fine if you list
what is missing. So: finish Phases 0–6 completely and polish them. Phase 7 extras (tests, dark
mode, virtualisation) only if you have time left over. A tight, complete, well-explained app
beats a sprawling half-broken one every time.

One more thing — the PDF says AI usage is completely fine and asks you to name your tools in
the README. Say so plainly. Hiding it reads worse than using it.
