import TicketRow from '@/features/tickets/components/TicketRow'
import type { Ticket } from '@/types/ticket'

interface TicketTableProps {
  tickets: Ticket[]
  selectedId?: string
  onOpen: (id: string) => void
}

export default function TicketTable({ tickets, selectedId, onOpen }: TicketTableProps) {
  return (
    <div className="overflow-hidden rounded-surface border border-line bg-surface">
      <table className="w-full table-fixed text-left">
        <thead className="border-b border-line bg-surface-sunken">
          <tr className="h-9 text-xs font-medium text-muted">
            <th className="w-[3px] p-0" />
            <th scope="col" className="pl-4 pr-4 font-medium">Customer / subject</th>
            <th scope="col" className="w-44 px-4 font-medium">Status</th>
            <th scope="col" className="w-28 px-4 font-medium">Created</th>
            <th className="w-10 pr-4" />
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <TicketRow
              key={ticket.id}
              ticket={ticket}
              selected={ticket.id === selectedId}
              onOpen={onOpen}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
