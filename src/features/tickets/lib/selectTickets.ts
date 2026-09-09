import type { TicketFilters } from '@/features/tickets/hooks/useTicketFilters'
import type { Priority, Ticket } from '@/types/ticket'

const PRIORITY_RANK: Record<Priority, number> = { high: 0, medium: 1, low: 2 }

function createdDescending(a: Ticket, b: Ticket): number {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
}

function sortTickets(tickets: Ticket[], sort: TicketFilters['sort']): Ticket[] {
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

/**
 * Pure: tickets plus filters in, a new sorted array out. Kept out of the hook so
 * it can be tested without a renderer.
 */
export function selectTickets(tickets: Ticket[], filters: TicketFilters): Ticket[] {
  const query = filters.q.trim().toLowerCase()

  const matched = tickets.filter((ticket) => {
    if (filters.status !== 'all' && ticket.status !== filters.status) return false
    if (filters.priority !== 'all' && ticket.priority !== filters.priority) return false
    if (!query) return true

    return (
      ticket.customer.name.toLowerCase().includes(query) ||
      ticket.subject.toLowerCase().includes(query) ||
      ticket.id.toLowerCase().includes(query)
    )
  })

  // filter() already copied, so sorting in place does not touch the input.
  return sortTickets(matched, filters.sort)
}
