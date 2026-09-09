import { useMemo } from 'react'
import { useTicketStore } from '@/features/tickets/store/ticketStore'

export interface TicketStats {
  total: number
  open: number
  in_progress: number
  resolved: number
}

/** Derived, never stored: two sources of truth for one number is how counts drift. */
export function useTicketStats(): TicketStats {
  const tickets = useTicketStore((state) => state.tickets)

  return useMemo(() => {
    const stats: TicketStats = { total: tickets.length, open: 0, in_progress: 0, resolved: 0 }
    for (const ticket of tickets) stats[ticket.status] += 1
    return stats
  }, [tickets])
}
