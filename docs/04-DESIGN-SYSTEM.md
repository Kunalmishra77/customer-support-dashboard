# Design system

## 1. The idea, in one line

This is a **workbench, not a dashboard**. Agents live in it for eight hours and use it to
triage. So it is dense, quiet, and legible, with exactly one loud signal: priority.

Consequences of that, decided up front:

- Grey canvas, white surfaces. Cards read as objects on a work surface rather than floating
  panels on white.
- **Borders, not shadows.** The only shadow in the app is on the detail panel, because that is
  the one element that genuinely sits above the page. Identical soft shadows under every card
  is the default SaaS-kit look and it flattens hierarchy.
- **Priority owns colour. Status stays quiet.** Two urgency scales shouting at once makes both
  unreadable. Priority appears as a coloured rule on the left edge of a row — structural,
  scannable at a glance, no reading required. Status is a 6px neutral-toned dot with a label.
- No decorative gradients. No ALL-CAPS eyebrow labels. No `→` glued to button text.

## 2. Palette

Six base values plus a small semantic set. Locked — do not improvise new hexes mid-build.

| Token | Hex | Use |
|---|---|---|
| `canvas` | `#EEF1F4` | Page background |
| `surface` | `#FFFFFF` | Cards, table, panel |
| `surface-sunken` | `#F6F8FA` | Table header, meta grid, message bubbles from agents |
| `line` | `#DCE1E7` | All 1px borders and dividers |
| `ink` | `#12171C` | Primary text, primary buttons |
| `muted` | `#5C6873` | Secondary text, labels, icons |

Interactive:

| Token | Hex | Use |
|---|---|---|
| `accent` | `#2551D6` | Focus rings, links, selected row tint base |
| `accent-tint` | `#EDF2FF` | Selected/active row background |

Priority (the loud scale):

| Priority | Edge rule | Text | Tint |
|---|---|---|---|
| High | `#C0392B` | `#9B2C1F` | `#FBEAE7` |
| Medium | `#C98A21` | `#8A5D0C` | `#FDF4E3` |
| Low | `#DCE1E7` | `#5C6873` | none |

Status (the quiet scale — dot colour only, label always in `ink`):

| Status | Dot |
|---|---|
| Open | `#3B6FE0` |
| In progress | `#7C5CE0` |
| Resolved | `#2E8B62` |

Feedback: success `#2E8B62`, danger `#C0392B`.

## 3. Type

**One family: IBM Plex Sans** (400 / 500 / 600), loaded from Google Fonts with `display=swap`.
It has an engineered, operational character that suits an internal tool, and it is not the
Inter-by-default look every second submission will have. Fallback stack:
`"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif`.

No second family. No monospace. Numbers use `font-variant-numeric: tabular-nums` so counts and
dates align in columns — that is what the mono face would have been for anyway.

Base is 14px, not 16px: this is a dense data interface, and 14 is the standard for tools of this
type. Body copy inside the detail panel goes back up to 15px because it is read, not scanned.

| Role | Size / line-height | Weight | Notes |
|---|---|---|---|
| Stat figure | 30px / 34px | 600 | tabular-nums |
| Panel subject | 20px / 28px | 600 | |
| Section heading | 15px / 22px | 600 | |
| Row primary (customer) | 14px / 20px | 500 | |
| Row secondary (subject) | 14px / 20px | 400 | `muted` |
| Body (description, messages) | 15px / 24px | 400 | max ~72ch |
| Label / meta | 12px / 16px | 500 | `muted`, sentence case |

Line length in the panel is capped with `max-w-[68ch]`.

## 4. Space, radius, motion

- 4px base scale: 4, 8, 12, 16, 24, 32, 48. Nothing off-scale.
- Page container: `max-w-[1200px]`, padding `px-4 md:px-6`, vertical rhythm 24px between blocks.
- Table row height 56px desktop. Touch targets ≥44px on mobile.
- Radius is **not** uniform: surfaces `10px`, controls and buttons `6px`, dots and avatars full.
  One radius on everything is a tell that no one made a decision.
- Motion: panel slide-in 180ms `ease-out`; everything else is instant except colour transitions
  on hover/focus at 120ms. Wrap in `@media (prefers-reduced-motion: reduce)` to disable
  transforms.

## 5. Tailwind v4 token block

Paste into `src/index.css` under `@import "tailwindcss";`

```css
@theme {
  --font-sans: "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;

  --color-canvas:         #EEF1F4;
  --color-surface:        #FFFFFF;
  --color-surface-sunken: #F6F8FA;
  --color-line:           #DCE1E7;
  --color-ink:            #12171C;
  --color-muted:          #5C6873;

  --color-accent:      #2551D6;
  --color-accent-tint: #EDF2FF;

  --color-prio-high:        #C0392B;
  --color-prio-high-text:   #9B2C1F;
  --color-prio-high-tint:   #FBEAE7;
  --color-prio-medium:      #C98A21;
  --color-prio-medium-text: #8A5D0C;
  --color-prio-medium-tint: #FDF4E3;

  --color-status-open:     #3B6FE0;
  --color-status-progress: #7C5CE0;
  --color-status-resolved: #2E8B62;

  --color-success: #2E8B62;
  --color-danger:  #C0392B;

  --radius-surface: 10px;
  --radius-control: 6px;
}

@layer base {
  html { font-size: 14px; }
  body { @apply bg-canvas text-ink font-sans antialiased; }
  :focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
  .tnum { font-variant-numeric: tabular-nums; }
}
```

## 6. Layout

### Desktop (≥1024px)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Ledgerly Support            Tickets                    AS  Aditi Sharma │  56px header, border-b
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  12          5           4              3                          │  │  one surface,
│  │  Total     Open      In progress    Resolved                       │  │  hairline dividers
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░                │  │  proportion bar
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌ Search ─────────────┐  [ All | Open | In progress | Resolved ]  ┌───┐ │
│  │ 🔍 Search tickets   │                                  Priority │ ▾ │ │
│  └─────────────────────┘                                           └───┘ │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │   Customer / subject              Status        Created            │  │  sunken header
│  │ ┃ Priya Nair                      ● Open        2h ago         ›   │  │  ┃ = priority rule
│  │ ┃ Invoice 4402 charged twice                                       │  │
│  │ ├──────────────────────────────────────────────────────────────────│  │
│  │ ┃ Marcus Webb                     ● In prog.    5h ago         ›   │  │
│  │ ┃ API key rotation broke webhooks                                  │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘

Panel open — overlays the right side, list stays visible and readable behind:

                              ┌──────────────────────────────────────┐
                              │ TCK-1042                          ✕  │
                              │ Invoice 4402 charged twice           │
                              ├──────────────────────────────────────┤
                              │  PN  Priya Nair                      │
                              │      priya@northgate.io · Growth     │
                              ├──────────────────────────────────────┤
                              │  Status  [ Open        ▾ ]           │
                              │  Priority  High                      │
                              │  Created  12 Sep 2026, 9:14 am       │
                              │  Channel  Email                      │
                              ├──────────────────────────────────────┤
                              │  Issue                               │
                              │  Full description text…              │
                              ├──────────────────────────────────────┤
                              │  Conversation                        │
                              │  ┌ Priya ─────────────┐              │
                              │  │ message            │              │
                              │  └────────────────────┘              │
                              │        ┌ Aditi (agent) ─────────┐    │
                              │        │ reply                  │    │
                              │        └────────────────────────┘    │
                              └──────────────────────────────────────┘
                              440px wide, full height, shadow, ink/40 scrim
```

### Mobile (<768px)

Stats become a 2×2 grid. Filters stack: search full width, then two selects side by side.
Rows become cards. The panel becomes a full-height sheet sliding up from the bottom, with the
close control fixed at the top.

```
┌─────────────────────────┐   ┌─────────────────────────┐
│ Ledgerly Support     AS │   │ ┃ Priya Nair            │
├─────────────────────────┤   │ ┃ Invoice 4402 charged  │
│ ┌──────────┬──────────┐ │   │ ┃ twice                 │
│ │ 12 Total │ 5 Open   │ │   │ ┃                       │
│ ├──────────┼──────────┤ │   │ ┃ ● Open   High   2h ago│
│ │ 4 In pr. │ 3 Resolv.│ │   └─────────────────────────┘
│ └──────────┴──────────┘ │
├─────────────────────────┤
│ 🔍 Search tickets       │
│ [Status ▾]  [Priority ▾]│
└─────────────────────────┘
```

Alignment is left throughout. Numbers in the stats strip are left-aligned under their labels,
not centred — centred figures in equal boxes is the generic dashboard treatment, and left
alignment scans faster against the rest of the page.

## 7. Component specs

**Button** — variants `primary` (ink bg, white text), `secondary` (surface bg, line border),
`ghost` (transparent, muted text). Sizes `sm` 32px, `md` 36px. Never more than one primary
button visible at a time.

**StatusDot** — 6px circle in the status colour + label in `ink`. In a `<Select>` for editing.

**PriorityTag** — used in the panel and mobile cards only. 12px text on the priority tint,
`radius-control`, 2px 8px padding. On desktop rows the edge rule carries priority instead;
adding both is redundant.

**Priority edge rule** — 3px full-height bar on the left of the row/card. Low priority uses the
`line` grey so the rule is present but silent, keeping row text alignment identical across
priorities.

**TicketRow** — hover `bg-surface-sunken`, active/selected `bg-accent-tint` with the accent as a
left-inner border. Whole row is the click target; the inline status `<select>` calls
`stopPropagation` so changing status does not open the panel. Test that explicitly.

**QueueSummary** — one surface, four figures separated by hairline vertical dividers, and a
thin 4px proportion bar underneath showing open/in-progress/resolved as widths. The bar is the
one small flourish in the app; it earns its place by encoding the same numbers in a form you can
read without focusing.

**Panel** — `role="dialog"`, `aria-modal`, scrim `rgba(18,23,28,0.4)`, close on Escape, scrim
click, and the ✕. Focus moves to the panel on open and returns to the row on close.

**MessageBubble** — customer messages left-aligned on `surface` with a `line` border; agent
messages right-aligned on `surface-sunken`. Author name and time above, 12px `muted`. No avatars
inside the thread — the names carry it and avatars would add noise at this density.

**Skeleton** — `bg-line` at 60% opacity with a gentle pulse, sized to the real element.

**Toast** — bottom-right (bottom-centre on mobile), auto-dismiss 4s, one line of text, danger or
success left border. Only used for optimistic-update failures.

**EmptyState** — a single line of direction, an action button, no illustration. "No tickets
match these filters." / "Clear filters".

## 8. Self-check before you call the UI done

- Squint at the list: can you find the high-priority tickets without reading? If not, the edge
  rule is too subtle.
- Is there more than one shadow in the app? Remove all but the panel's.
- Is any text below 12px, or grey-on-grey below 4.5:1? Fix it.
- Does the 375px view have any horizontal scroll? Long subjects and emails are the usual cause —
  `truncate` and `break-words`.
- Tab through the whole page with the mouse untouched. Every stop should be visible.
