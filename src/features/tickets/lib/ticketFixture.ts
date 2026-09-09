import type { Priority, Status, Ticket } from '@/types/ticket'

interface Overrides {
  id?: string
  subject?: string
  customerName?: string
  priority?: Priority
  status?: Status
  createdAt?: string
}

/** Minimal ticket builder so a test only states the fields it cares about. */
export function makeTicket(overrides: Overrides = {}): Ticket {
  const {
    id = 'TCK-1000',
    subject = 'A subject',
    customerName = 'Test Customer',
    priority = 'medium',
    status = 'open',
    createdAt = '2026-09-01T09:00:00.000Z',
  } = overrides

  return {
    id,
    subject,
    description: 'A description',
    priority,
    status,
    channel: 'email',
    createdAt,
    updatedAt: createdAt,
    customer: {
      id: 'CUS-1',
      name: customerName,
      email: 'test@example.com',
      company: 'Test Co',
      plan: 'Growth',
    },
    assignee: null,
    tags: [],
    messages: [],
  }
}
