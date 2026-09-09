import PriorityTag from '@/features/tickets/components/PriorityTag'
import StatusSelect from '@/features/tickets/components/StatusSelect'
import { CHANNEL_LABEL } from '@/lib/constants'
import { formatAbsolute } from '@/lib/date'
import type { Ticket } from '@/types/ticket'

interface MetaGridProps {
  ticket: Ticket
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted">{label}</p>
      <div className="mt-1">{children}</div>
    </div>
  )
}

export default function MetaGrid({ ticket }: MetaGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 border-b border-line bg-surface-sunken p-4 md:p-6">
      <Field label="Status">
        {/* No stopRowActivation here: there is no row underneath to protect. */}
        <StatusSelect ticketId={ticket.id} status={ticket.status} />
      </Field>
      <Field label="Priority">
        <PriorityTag priority={ticket.priority} />
      </Field>
      <Field label="Created">
        <p className="tnum">{formatAbsolute(ticket.createdAt)}</p>
      </Field>
      <Field label="Last updated">
        <p className="tnum">{formatAbsolute(ticket.updatedAt)}</p>
      </Field>
      <Field label="Channel">
        <p>{CHANNEL_LABEL[ticket.channel]}</p>
      </Field>
      <Field label="Assignee">
        <p>{ticket.assignee ?? 'Unassigned'}</p>
      </Field>
    </div>
  )
}
