import type { Status, Ticket } from '@/types/ticket'

// BASE_URL keeps the request correct if the app is ever served from a subpath.
const BASE = import.meta.env.BASE_URL
const FAIL_RATE = Number(import.meta.env.VITE_FAIL_RATE ?? 0)

export class ApiError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Dev-only error injection so the error state is reachable on demand. */
function maybeFail(): void {
  if (FAIL_RATE > 0 && Math.random() < FAIL_RATE) {
    throw new ApiError('Injected failure via VITE_FAIL_RATE', 500)
  }
}

export async function getTickets(signal?: AbortSignal): Promise<Ticket[]> {
  await delay(700)
  maybeFail()

  const res = await fetch(`${BASE}api/tickets.json`, { signal })
  if (!res.ok) throw new ApiError(`Request failed with ${res.status}`, res.status)

  return (await res.json()) as Ticket[]
}

/**
 * Simulated write. There is no backend, so this only proves the round trip:
 * the store applies the change optimistically and rolls back if this throws.
 */
export async function patchTicketStatus(
  id: string,
  status: Status,
): Promise<{ id: string; status: Status }> {
  await delay(400)
  maybeFail()

  return { id, status }
}
