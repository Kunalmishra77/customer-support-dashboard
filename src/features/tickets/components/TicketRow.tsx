import type { KeyboardEvent } from 'react'
import { ChevronRight } from 'lucide-react'
import PriorityTag from '@/features/tickets/components/PriorityTag'
import StatusSelect from '@/features/tickets/components/StatusSelect'
import TicketTags from '@/features/tickets/components/TicketTags'
import { cn } from '@/lib/cn'
import { PRIORITY_META, STATUS_META } from '@/lib/constants'
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
      // Priority and status belong in the accessible name: the edge rule is
      // colour only, which a screen reader cannot convey.
      aria-label={`Open ticket ${ticket.id}, ${ticket.subject}, ${PRIORITY_META[ticket.priority].label} priority, ${STATUS_META[ticket.status].label}`}
      onClick={() => onOpen(ticket.id)}
      onKeyDown={handleKeyDown}
      className={cn(
        'h-14 cursor-pointer border-b border-line transition-colors duration-[120ms] last:border-b-0',
        selected ? 'bg-accent-tint' : 'hover:bg-surface-sunken',
      )}
    >
      <td className={cn('w-[3px] p-0', PRIORITY_META[ticket.priority].ruleClass)} />

      <td className="max-w-0 py-2 pl-4 pr-4">
        <div className="flex items-baseline gap-2">
          {/* The ID is searchable, so it has to be readable. */}
          <span className="tnum shrink-0 text-xs text-muted">{ticket.id}</span>
          <p className="truncate font-medium leading-5" title={ticket.customer.name}>
            {ticket.customer.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <p className="truncate leading-5 text-muted" title={ticket.subject}>
            {ticket.subject}
          </p>
          <span className="hidden shrink-0 items-center gap-1 lg:flex">
            <TicketTags tags={ticket.tags} limit={2} />
          </span>
        </div>
      </td>

      {/* The edge rule scans fastest, but colour alone fails WCAG 1.4.1 and the
          brief asks for priority as a field, so it is spelled out too. */}
      <td className="w-24 px-4">
        <PriorityTag priority={ticket.priority} />
      </td>

      <td className="w-48 px-4">
        <StatusSelect ticketId={ticket.id} status={ticket.status} stopRowActivation />
      </td>

      <td className="hidden w-40 truncate px-4 text-muted lg:table-cell">
        {ticket.assignee ?? 'Unassigned'}
      </td>

      <td className="tnum w-24 px-4 text-muted" title={formatAbsolute(ticket.createdAt)}>
        {formatRelative(ticket.createdAt)}
      </td>

      <td className="w-10 pr-4 text-muted">
        <ChevronRight aria-hidden="true" size={16} />
      </td>
    </tr>
  )
}
