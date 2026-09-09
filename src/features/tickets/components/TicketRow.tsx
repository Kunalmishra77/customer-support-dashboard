import type { KeyboardEvent } from 'react'
import { ChevronRight } from 'lucide-react'
import StatusSelect from '@/features/tickets/components/StatusSelect'
import { cn } from '@/lib/cn'
import { PRIORITY_META } from '@/lib/constants'
import { formatAbsolute, formatRelative } from '@/lib/date'
import type { Ticket } from '@/types/ticket'

interface TicketRowProps {
  ticket: Ticket
  selected: boolean
  onOpen: (id: string) => void
}

export default function TicketRow({ ticket, selected, onOpen }: TicketRowProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLTableRowElement>) {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    onOpen(ticket.id)
  }

  return (
    <tr
      role="button"
      tabIndex={0}
      aria-label={`Open ticket ${ticket.id}, ${ticket.subject}`}
      onClick={() => onOpen(ticket.id)}
      onKeyDown={handleKeyDown}
      className={cn(
        'h-14 cursor-pointer border-b border-line transition-colors duration-[120ms] last:border-b-0',
        selected ? 'bg-accent-tint' : 'hover:bg-surface-sunken',
      )}
    >
      <td className={cn('w-[3px] p-0', PRIORITY_META[ticket.priority].ruleClass)} />

      <td className="max-w-0 py-2 pl-4 pr-4">
        <p className="truncate font-medium leading-5" title={ticket.customer.name}>
          {ticket.customer.name}
        </p>
        <p className="truncate leading-5 text-muted" title={ticket.subject}>
          {ticket.subject}
        </p>
      </td>

      <td className="w-44 px-4">
        <StatusSelect ticketId={ticket.id} status={ticket.status} stopRowActivation />
      </td>

      <td className="tnum w-28 px-4 text-muted" title={formatAbsolute(ticket.createdAt)}>
        {formatRelative(ticket.createdAt)}
      </td>

      <td className="w-10 pr-4 text-muted">
        <ChevronRight aria-hidden="true" size={16} />
      </td>
    </tr>
  )
}
