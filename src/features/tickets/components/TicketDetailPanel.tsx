import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Panel from '@/components/ui/Panel'
import Skeleton from '@/components/ui/Skeleton'
import CustomerBlock from '@/features/tickets/components/CustomerBlock'
import DescriptionBlock from '@/features/tickets/components/DescriptionBlock'
import MessageList from '@/features/tickets/components/MessageList'
import MetaGrid from '@/features/tickets/components/MetaGrid'
import PanelHeader from '@/features/tickets/components/PanelHeader'
import { useTicketStore } from '@/features/tickets/store/ticketStore'

const TITLE_ID = 'ticket-panel-title'

export default function TicketDetailPanel() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const requestStatus = useTicketStore((state) => state.status)
  const ticket = useTicketStore((state) => state.tickets.find((item) => item.id === id))

  // Carrying location.search back is what keeps the filters when the panel closes.
  function close() {
    navigate({ pathname: '/', search: location.search })
  }

  // On a deep link the tickets have not arrived yet. Without this the panel
  // would claim "not found" for a ticket that simply has not loaded.
  if (requestStatus === 'idle' || requestStatus === 'loading') {
    return (
      <Panel labelledBy={TITLE_ID} onClose={close}>
        <div className="flex items-start gap-4 border-b border-line p-4 md:p-6">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-7 w-56" />
          </div>
        </div>
        <div className="space-y-3 p-4 md:p-6">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>
        <h2 id={TITLE_ID} className="sr-only">
          Loading ticket
        </h2>
      </Panel>
    )
  }

  if (!ticket) {
    return (
      <Panel labelledBy={TITLE_ID} onClose={close}>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
          <h2 id={TITLE_ID} className="text-xl font-semibold">
            Ticket not found
          </h2>
          <p className="text-muted">No ticket matches the id {id}.</p>
          <Button variant="secondary" onClick={close}>
            Back to the queue
          </Button>
        </div>
      </Panel>
    )
  }

  return (
    <Panel labelledBy={TITLE_ID} onClose={close}>
      <PanelHeader
        ticketId={ticket.id}
        subject={ticket.subject}
        titleId={TITLE_ID}
        onClose={close}
      />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <CustomerBlock customer={ticket.customer} />
        <MetaGrid ticket={ticket} />
        <DescriptionBlock description={ticket.description} />
        <MessageList messages={ticket.messages} />
      </div>
    </Panel>
  )
}
