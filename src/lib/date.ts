const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

// numeric 'always' keeps the column scannable: "1d ago" beside "2d ago",
// rather than 'auto' swapping in "yesterday".
const relative = new Intl.RelativeTimeFormat('en', { numeric: 'always', style: 'narrow' })

const absolute = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
})

/** "2h ago", "45m ago", "3d ago". `now` is injectable so this is testable. */
export function formatRelative(iso: string, now: number = Date.now()): string {
  const diff = new Date(iso).getTime() - now
  const size = Math.abs(diff)

  if (size < MINUTE) return 'just now'
  if (size < HOUR) return relative.format(Math.round(diff / MINUTE), 'minute')
  if (size < DAY) return relative.format(Math.round(diff / HOUR), 'hour')
  return relative.format(Math.round(diff / DAY), 'day')
}

/** "9 Sept 2026, 2:44 pm" in the viewer's timezone. Used for tooltips and the panel. */
export function formatAbsolute(iso: string): string {
  return absolute.format(new Date(iso))
}
