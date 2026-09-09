import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useFilteredTickets } from '@/features/tickets/hooks/useFilteredTickets'
import { useTicketFilters } from '@/features/tickets/hooks/useTicketFilters'
import { useTicketStats } from '@/features/tickets/hooks/useTicketStats'
import { useTicketStore } from '@/features/tickets/store/ticketStore'
import { useUiStore } from '@/features/tickets/store/uiStore'

// Placeholder for Phase 2 only - the queue UI arrives in Phase 3.
export default function DashboardPage() {
  const status = useTicketStore((state) => state.status)
  const error = useTicketStore((state) => state.error)
  const tickets = useTicketStore((state) => state.tickets)
  const fetchTickets = useTicketStore((state) => state.fetchTickets)
  const updateStatus = useTicketStore((state) => state.updateStatus)

  const stats = useTicketStats()
  const filtered = useFilteredTickets()
  const { filters } = useTicketFilters()

  useEffect(() => {
    const controller = new AbortController()
    fetchTickets(controller.signal)
    // Aborting on cleanup stops StrictMode's first, discarded run from landing.
    return () => controller.abort()
  }, [fetchTickets])

  // TEMPORARY Phase 2 verification - removed in Phase 3. Exposes the store so the
  // optimistic rollback can be driven by hand from the console.
  useEffect(() => {
    Object.assign(window, { ticketStore: useTicketStore, uiStore: useUiStore })
  }, [])

  useEffect(() => {
    console.log('[phase2] status:', status, '| error:', error)
    console.log('[phase2] tickets:', tickets.length, tickets)
    console.log('[phase2] stats:', stats)
    console.log('[phase2] filters:', filters, '| filtered:', filtered.length)
  }, [status, error, tickets, stats, filters, filtered])

  return (
    <>
      <div className="rounded-surface border border-line bg-surface p-6">
        <h1 className="text-xl font-semibold">Phase 2 - data layer</h1>
        <p className="mt-2 text-muted">
          Open the console. Store status is <span className="font-medium text-ink">{status}</span>,
          holding <span className="tnum font-medium text-ink">{tickets.length}</span> tickets,
          <span className="tnum font-medium text-ink"> {filtered.length}</span> after filters.
        </p>
        <p className="tnum mt-4 text-muted">
          total {stats.total} / open {stats.open} / in progress {stats.in_progress} / resolved{' '}
          {stats.resolved}
        </p>
        {error && <p className="mt-4 text-danger">{error}</p>}
        <button
          type="button"
          className="mt-4 h-9 rounded-control border border-line px-4 font-medium transition-colors duration-[120ms] hover:bg-surface-sunken"
          onClick={() => {
            const first = filtered[0]
            if (first) updateStatus(first.id, first.status === 'resolved' ? 'open' : 'resolved')
          }}
        >
          Toggle first ticket's status (optimistic)
        </button>
      </div>
      <Outlet />
    </>
  )
}
