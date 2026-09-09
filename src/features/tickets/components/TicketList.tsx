import { useLocation, useMatch, useNavigate } from 'react-router-dom'
import TicketCardList from '@/features/tickets/components/TicketCardList'
import TicketListSkeleton from '@/features/tickets/components/TicketListSkeleton'
import TicketTable from '@/features/tickets/components/TicketTable'
import TicketsEmpty from '@/features/tickets/components/TicketsEmpty'
import TicketsError from '@/features/tickets/components/TicketsError'
import { useFilteredTickets } from '@/features/tickets/hooks/useFilteredTickets'
import { useTicketFilters } from '@/features/tickets/hooks/useTicketFilters'
import { useTicketStore } from '@/features/tickets/store/ticketStore'

export default function TicketList() {
  const requestStatus = useTicketStore((state) => state.status)
  const error = useTicketStore((state) => state.error)
  const ticketCount = useTicketStore((state) => state.tickets.length)
  const fetchTickets = useTicketStore((state) => state.fetchTickets)

  const filtered = useFilteredTickets()
  const { clearFilters } = useTicketFilters()

  const navigate = useNavigate()
  const location = useLocation()
  // useMatch rather than the params hook: :id belongs to the nested child
  // route, and a parent route cannot read a child's params.
  const selectedId = useMatch('/tickets/:id')?.params.id

  // Carrying location.search is what stops the filters vanishing when a ticket opens.
  function openTicket(id: string) {
    navigate({ pathname: `/tickets/${id}`, search: location.search })
  }

  if (requestStatus === 'idle' || requestStatus === 'loading') return <TicketListSkeleton />

  if (requestStatus === 'error') {
    return <TicketsError message={error ?? 'Something went wrong.'} onRetry={() => fetchTickets()} />
  }

  if (ticketCount === 0) {
    return <TicketsEmpty variant="no-tickets" onClearFilters={clearFilters} />
  }

  if (filtered.length === 0) {
    return <TicketsEmpty variant="no-results" onClearFilters={clearFilters} />
  }

  return (
    <>
      {/* Two components rather than one reflowing with CSS: a table that turns
          into cards ends up as divs pretending to be cells. */}
      <div className="hidden md:block">
        <TicketTable tickets={filtered} selectedId={selectedId} onOpen={openTicket} />
      </div>
      <div className="md:hidden">
        <TicketCardList tickets={filtered} selectedId={selectedId} onOpen={openTicket} />
      </div>
    </>
  )
}
