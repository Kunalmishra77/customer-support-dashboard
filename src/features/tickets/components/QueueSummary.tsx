import StatFigure from '@/features/tickets/components/StatFigure'
import { useTicketStats } from '@/features/tickets/hooks/useTicketStats'
import { useTicketStore } from '@/features/tickets/store/ticketStore'

export default function QueueSummary() {
  const requestStatus = useTicketStore((state) => state.status)
  const stats = useTicketStats()

  const loading = requestStatus === 'idle' || requestStatus === 'loading'
  const failed = requestStatus === 'error'
  const total = stats.total || 1

  const segments = [
    { key: 'open', width: (stats.open / total) * 100, className: 'bg-status-open' },
    { key: 'in_progress', width: (stats.in_progress / total) * 100, className: 'bg-status-progress' },
    { key: 'resolved', width: (stats.resolved / total) * 100, className: 'bg-status-resolved' },
  ]

  return (
    <section
      aria-label="Queue summary"
      className="overflow-hidden rounded-surface border border-line bg-surface"
    >
      {/* gap-px over a line-coloured background gives hairline dividers that
          survive the switch from four columns to two. */}
      <div className="grid grid-cols-2 gap-px bg-line md:grid-cols-4">
        <StatFigure label="Total" value={failed ? null : stats.total} loading={loading} />
        <StatFigure label="Open" value={failed ? null : stats.open} loading={loading} />
        <StatFigure label="In progress" value={failed ? null : stats.in_progress} loading={loading} />
        <StatFigure label="Resolved" value={failed ? null : stats.resolved} loading={loading} />
      </div>

      <div className="px-4 pb-4 md:px-6 md:pb-6">
        <div className="flex h-1 overflow-hidden rounded-full bg-line">
          {!loading && !failed &&
            segments.map((segment) => (
              <div key={segment.key} className={segment.className} style={{ width: `${segment.width}%` }} />
            ))}
        </div>
      </div>
    </section>
  )
}
