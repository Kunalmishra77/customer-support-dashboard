import { beforeEach, describe, expect, it, vi } from 'vitest'
import { makeTicket } from '@/features/tickets/lib/ticketFixture'
import { useTicketStore } from '@/features/tickets/store/ticketStore'
import { useUiStore } from '@/features/tickets/store/uiStore'
import { patchTicketStatus } from '@/features/tickets/api/ticketsApi'

// Only the two network functions are replaced; ApiError and delay stay real.
vi.mock('@/features/tickets/api/ticketsApi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/features/tickets/api/ticketsApi')>()
  return { ...actual, getTickets: vi.fn(), patchTicketStatus: vi.fn() }
})

const CREATED_AT = '2026-09-01T09:00:00.000Z'
const ticket = () => useTicketStore.getState().tickets[0]

beforeEach(() => {
  vi.clearAllMocks()
  useTicketStore.setState({
    tickets: [makeTicket({ id: 'TCK-1', status: 'open', createdAt: CREATED_AT })],
    status: 'success',
    error: null,
  })
  useUiStore.setState({ toasts: [] })
})

describe('updateStatus', () => {
  it('applies the change before the request resolves', async () => {
    let resolveRequest = () => {}
    vi.mocked(patchTicketStatus).mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = () => resolve({ id: 'TCK-1', status: 'resolved' })
      }),
    )

    const pending = useTicketStore.getState().updateStatus('TCK-1', 'resolved')

    // The request has not settled yet, but the UI state has already moved.
    expect(ticket().status).toBe('resolved')
    expect(ticket().updatedAt).not.toBe(CREATED_AT)

    resolveRequest()
    await pending
    expect(ticket().status).toBe('resolved')
  })

  it('rolls the status and updatedAt back when the request fails, and warns', async () => {
    vi.mocked(patchTicketStatus).mockRejectedValue(new Error('network down'))

    await useTicketStore.getState().updateStatus('TCK-1', 'resolved')

    expect(ticket().status).toBe('open')
    expect(ticket().updatedAt).toBe(CREATED_AT)

    const toasts = useUiStore.getState().toasts
    expect(toasts).toHaveLength(1)
    expect(toasts[0].tone).toBe('danger')
  })

  it('does not fire a request when the status is unchanged', async () => {
    await useTicketStore.getState().updateStatus('TCK-1', 'open')
    expect(patchTicketStatus).not.toHaveBeenCalled()
  })

  it('ignores an unknown ticket id', async () => {
    await useTicketStore.getState().updateStatus('TCK-does-not-exist', 'resolved')
    expect(patchTicketStatus).not.toHaveBeenCalled()
    expect(ticket().status).toBe('open')
  })
})
