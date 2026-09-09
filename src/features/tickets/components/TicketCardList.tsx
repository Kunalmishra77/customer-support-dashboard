import TicketCard from '@/features/tickets/components/TicketCard'
import type { Ticket } from '@/types/ticket'

interface TicketCardListProps {
  tickets: Ticket[]
  selectedId?: string
  onOpen: (id: string) => void
}

export default function TicketCardList({ tickets, selectedId, onOpen }: TicketCardListProps) {
  return (
    <div className="flex flex-col gap-3">
      {tickets.map((ticket) => (
        <TicketCard
          key={ticket.id}
          ticket={ticket}
          selected={ticket.id === selectedId}
          onOpen={onOpen}
        />
      ))}
    </div>
  )
}
