import { create } from 'zustand'
import { ApiError, getTickets, patchTicketStatus } from '@/features/tickets/api/ticketsApi'
import { useUiStore } from '@/features/tickets/store/uiStore'
import type { Status, Ticket } from '@/types/ticket'

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error'

interface TicketStore {
  tickets: Ticket[]
  status: RequestStatus
  error: string | null
  fetchTickets: (signal?: AbortSignal) => Promise<void>
  updateStatus: (id: string, next: Status) => Promise<void>
}

const LOAD_FAILED = "Couldn't load tickets. Check your connection and try again."

function isAbort(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

function withStatus(
  tickets: Ticket[],
  id: string,
  status: Status,
  updatedAt: string,
): Ticket[] {
  return tickets.map((ticket) =>
    ticket.id === id ? { ...ticket, status, updatedAt } : ticket,
  )
}

export const useTicketStore = create<TicketStore>((set, get) => ({
  tickets: [],
  status: 'idle',
  error: null,

  fetchTickets: async (signal) => {
    set({ status: 'loading', error: null })

    try {
      const tickets = await getTickets(signal)
      set({ tickets, status: 'success', error: null })
    } catch (error) {
      // An abort is our own cleanup, not a failure. Leaving state untouched lets
      // StrictMode's second effect settle it instead of flashing an error.
      if (isAbort(error)) return

      const message =
        error instanceof ApiError && error.status
          ? `Couldn't load tickets (error ${error.status}). Check your connection and try again.`
          : LOAD_FAILED

      set({ status: 'error', error: message })
    }
  },

  updateStatus: async (id, next) => {
    const target = get().tickets.find((ticket) => ticket.id === id)
    if (!target || target.status === next) return

    const previousStatus = target.status
    const previousUpdatedAt = target.updatedAt

    // Optimistic: patch first, so the row, the panel and the counters all move
    // together off one source of truth before the request resolves.
    set({ tickets: withStatus(get().tickets, id, next, new Date().toISOString()) })

    try {
      await patchTicketStatus(id, next)
    } catch {
      set({
        tickets: withStatus(get().tickets, id, previousStatus, previousUpdatedAt),
      })
      useUiStore.getState().pushToast("Couldn't update the status. Please try again.")
    }
  },
}))
