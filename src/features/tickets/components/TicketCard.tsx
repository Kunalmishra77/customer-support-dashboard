import type { KeyboardEvent } from 'react'
import PriorityTag from '@/features/tickets/components/PriorityTag'
import StatusSelect from '@/features/tickets/components/StatusSelect'
import { cn } from '@/lib/cn'
import { PRIORITY_META, STATUS_META } from '@/lib/constants'
import { formatAbsolute, formatRelative } from '@/lib/date'
import type { Ticket } from '@/types/ticket'

interface TicketCardProps {
  ticket: Ticket
  selected: boolean
  onOpen: (id: string) => void
}

export default function TicketCard({ ticket, selected, onOpen }: TicketCardProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    onOpen(ticket.id)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      // Matches the table row: the card shows a priority tag, but the accessible
      // name should carry priority and status too.
      aria-label={`Open ticket ${ticket.id}, ${ticket.subject}, ${PRIORITY_META[ticket.priority].label} priority, ${STATUS_META[ticket.status].label}`}
      onClick={() => onOpen(ticket.id)}
      onKeyDown={handleKeyDown}
      className={cn(
        'flex cursor-pointer overflow-hidden rounded-surface border border-line transition-colors duration-[120ms]',
        selected ? 'bg-accent-tint' : 'bg-surface',
      )}
    >
      <span className={cn('w-[3px] shrink-0', PRIORITY_META[ticket.priority].ruleClass)} />

      <div className="min-w-0 flex-1 p-4">
        <p className="truncate font-medium">{ticket.customer.name}</p>
        <p className="mt-1 break-words text-muted">{ticket.subject}</p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <StatusSelect ticketId={ticket.id} status={ticket.status} stopRowActivation />
          <PriorityTag priority={ticket.priority} />
          <span className="tnum ml-auto text-muted" title={formatAbsolute(ticket.createdAt)}>
            {formatRelative(ticket.createdAt)}
          </span>
        </div>
      </div>
    </div>
  )
}
