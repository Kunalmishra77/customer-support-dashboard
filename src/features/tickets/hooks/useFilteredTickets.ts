import { useMemo } from 'react'
import { useTicketFilters } from '@/features/tickets/hooks/useTicketFilters'
import { selectTickets } from '@/features/tickets/lib/selectTickets'
import { useTicketStore } from '@/features/tickets/store/ticketStore'
import type { Ticket } from '@/types/ticket'

/** Thin wrapper: the filtering and sorting itself lives in selectTickets. */
export function useFilteredTickets(): Ticket[] {
  const tickets = useTicketStore((state) => state.tickets)
  const { filters } = useTicketFilters()
  const { q, status, priority, sort } = filters

  return useMemo(
    () => selectTickets(tickets, { q, status, priority, sort }),
    [tickets, q, status, priority, sort],
  )
}
