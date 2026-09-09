# Deployment and submission

## 1. Repo hygiene

The commit history is part of what they see. Commit at each phase boundary with messages that
describe the change:

```
chore: scaffold vite + react + tailwind
feat: design tokens and ui primitives
feat: tickets api layer and zustand store
feat: queue view with search, filters and inline status change
feat: ticket detail panel with url routing
fix: preserve filters when closing the detail panel
polish: responsive pass and keyboard accessibility
docs: readme with setup and ai usage
```

One giant "initial commit" containing the whole app is a small negative signal. Eight honest
commits over three hours is a positive one.

Repo name: `customer-support-dashboard`. Public. No `node_modules`, no `.env.local`, no
`dist/` — check `.gitignore` before the first push.

```bash
git remote add origin https://github.com/<you>/customer-support-dashboard.git
git branch -M main
git push -u origin main
```

## 2. The Vercel SPA rewrite — do not skip this

The app has a real route at `/tickets/TCK-1042`. On a static host, that path has no file, so a
direct visit or refresh returns 404. The fix is a rewrite to `index.html` — but it must **not**
swallow `/api/tickets.json`, or the app will fetch HTML and fail to parse it.

`vercel.json` at the project root:

```json
{
  "rewrites": [
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ]
}
```

Test both after deploying: the deep link loads, and the Network tab shows
`api/tickets.json` returning JSON with a 200.

## 3. Deploy

1. vercel.com → Add New → Project → import the GitHub repo.
2. Framework preset: **Vite**. Build `npm run build`, output `dist`. Vercel detects this.
3. Environment variables: none needed. Leave `VITE_FAIL_RATE` unset so production never fails
   on purpose. Keep it in `.env.local` only, which is gitignored.
4. Deploy. Every push to `main` redeploys automatically.

Before you call it done, run `npm run build && npm run preview` locally. The preview server is
much closer to production than the dev server and catches build-only breakage.

## 4. Pre-submission checklist

Run this against the **deployed URL**, not localhost.

**Works**
- [ ] Live URL loads with no console errors
- [ ] Loading skeleton is visible on a hard refresh (throttle to Fast 3G to confirm)
- [ ] All four stats are correct and match the ticket data
- [ ] Search finds a ticket by customer name, by subject word, and by ticket id
- [ ] Status filter and priority filter both work, and work together with search
- [ ] Changing status from a row updates the row and the stats immediately
- [ ] Changing status from the panel does the same, with the panel still open
- [ ] Opening a ticket shows customer info, description, status, priority, dates, conversation
- [ ] Deep link `/tickets/TCK-1042` loads directly in a fresh tab
- [ ] An unknown id shows the not-found state instead of a blank screen
- [ ] Closing the panel keeps your filters
- [ ] Empty state appears for a nonsense search, and Clear filters restores the list

**Looks right**
- [ ] Opened on a real phone, not just devtools — check tap targets and the bottom sheet
- [ ] 768px and 1440px both look deliberate, not stretched
- [ ] No horizontal scrollbar at any width
- [ ] Long content truncates cleanly

**Reads right**
- [ ] README: what it is, stack, setup steps, folder structure, decisions, AI tools used,
      known limitations, what's remaining
- [ ] Live link and repo link both in the README
- [ ] No leftover `console.log`, no commented-out blocks, no `TODO` in shipped code
- [ ] No unused files or dependencies

## 5. The submission message

Keep it short. Something like:

> Hi <name>,
>
> Here's my submission for the frontend task.
>
> Repo: <github url>
> Live: <vercel url>
>
> Built with React + TypeScript, Vite, Tailwind, and Zustand. The README covers setup,
> the structure, the main decisions I made, and the AI tools I used.
>
> A couple of notes: ticket data is served as a static JSON endpoint and status updates are
> simulated client-side, since there's no backend — the README says where that shows up.
> Filters and the open ticket are held in the URL so views are shareable and refresh-safe.
>
> Happy to walk through the code whenever suits you.

Naming a limitation yourself before they find it changes how the whole review reads.

## 6. Then read `07-INTERVIEW-PREP.md`

Round 2 is them asking you to explain, debug or modify this app. Twenty minutes with that
document is the highest-return time in this whole exercise.
