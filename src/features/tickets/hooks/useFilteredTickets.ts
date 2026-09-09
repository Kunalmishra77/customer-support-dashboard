import { useMemo } from 'react'
import { useTicketFilters, type SortOption } from '@/features/tickets/hooks/useTicketFilters'
import { useTicketStore } from '@/features/tickets/store/ticketStore'
import type { Priority, Ticket } from '@/types/ticket'

const PRIORITY_RANK: Record<Priority, number> = { high: 0, medium: 1, low: 2 }

function createdDescending(a: Ticket, b: Ticket): number {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
}

function sortTickets(tickets: Ticket[], sort: SortOption): Ticket[] {
  switch (sort) {
    case 'oldest':
      return tickets.sort((a, b) => -createdDescending(a, b))
    case 'priority':
      return tickets.sort(
        (a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || createdDescending(a, b),
      )
    case 'newest':
      return tickets.sort(createdDescending)
  }
}

export function useFilteredTickets(): Ticket[] {
  const tickets = useTicketStore((state) => state.tickets)
  const { filters } = useTicketFilters()
  const { q, status, priority, sort } = filters

  return useMemo(() => {
    const query = q.trim().toLowerCase()

    const matched = tickets.filter((ticket) => {
      if (status !== 'all' && ticket.status !== status) return false
      if (priority !== 'all' && ticket.priority !== priority) return false
      if (!query) return true

      return (
        ticket.customer.name.toLowerCase().includes(query) ||
        ticket.subject.toLowerCase().includes(query) ||
        ticket.id.toLowerCase().includes(query)
      )
    })

    // filter() already copied, so sorting in place does not touch store state.
    return sortTickets(matched, sort)
  }, [tickets, q, status, priority, sort])
}
