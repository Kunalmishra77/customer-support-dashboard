import { describe, expect, it } from 'vitest'
import { makeTicket } from '@/features/tickets/lib/ticketFixture'
import { selectTickets } from '@/features/tickets/lib/selectTickets'
import type { TicketFilters } from '@/features/tickets/hooks/useTicketFilters'

const DEFAULTS: TicketFilters = { q: '', status: 'all', priority: 'all', sort: 'newest' }
const filters = (overrides: Partial<TicketFilters> = {}): TicketFilters => ({
  ...DEFAULTS,
  ...overrides,
})

const TICKETS = [
  makeTicket({
    id: 'TCK-1042',
    subject: 'Invoice charged twice',
    customerName: 'Priya Nair',
    priority: 'high',
    status: 'open',
    createdAt: '2026-09-09T09:00:00.000Z',
  }),
  makeTicket({
    id: 'TCK-1041',
    subject: 'Webhooks failing',
    customerName: 'Marcus Webb',
    priority: 'low',
    status: 'in_progress',
    createdAt: '2026-09-05T09:00:00.000Z',
  }),
  makeTicket({
    id: 'TCK-1039',
    subject: 'Refund not received',
    customerName: 'Grace Okafor',
    priority: 'medium',
    status: 'open',
    createdAt: '2026-09-01T09:00:00.000Z',
  }),
]

const ids = (tickets: ReturnType<typeof selectTickets>) => tickets.map((t) => t.id)

describe('selectTickets', () => {
  it('matches the search against customer name, subject and ticket id', () => {
    expect(ids(selectTickets(TICKETS, filters({ q: 'Priya' })))).toEqual(['TCK-1042'])
    expect(ids(selectTickets(TICKETS, filters({ q: 'refund' })))).toEqual(['TCK-1039'])
    expect(ids(selectTickets(TICKETS, filters({ q: 'TCK-1041' })))).toEqual(['TCK-1041'])
  })

  it('ignores case and surrounding whitespace in the query', () => {
    expect(ids(selectTickets(TICKETS, filters({ q: '  tck-1041  ' })))).toEqual(['TCK-1041'])
  })

  it('combines the status and priority filters with the search', () => {
    expect(ids(selectTickets(TICKETS, filters({ status: 'open' })))).toEqual([
      'TCK-1042',
      'TCK-1039',
    ])
    expect(ids(selectTickets(TICKETS, filters({ status: 'open', priority: 'high' })))).toEqual([
      'TCK-1042',
    ])
    expect(
      ids(selectTickets(TICKETS, filters({ status: 'open', priority: 'high', q: 'refund' }))),
    ).toEqual([])
  })

  it('sorts by newest, oldest and priority', () => {
    expect(ids(selectTickets(TICKETS, filters({ sort: 'newest' })))).toEqual([
      'TCK-1042',
      'TCK-1041',
      'TCK-1039',
    ])
    expect(ids(selectTickets(TICKETS, filters({ sort: 'oldest' })))).toEqual([
      'TCK-1039',
      'TCK-1041',
      'TCK-1042',
    ])
    expect(ids(selectTickets(TICKETS, filters({ sort: 'priority' })))).toEqual([
      'TCK-1042',
      'TCK-1039',
      'TCK-1041',
    ])
  })

  it('does not mutate or reorder the array it was given', () => {
    const input = [...TICKETS]
    selectTickets(input, filters({ sort: 'oldest' }))
    expect(ids(input)).toEqual(['TCK-1042', 'TCK-1041', 'TCK-1039'])
  })
})
