import Select from '@/components/ui/Select'
import Dot from '@/components/ui/Dot'
import { STATUS_META, STATUS_VALUES } from '@/lib/constants'
import { useTicketStore } from '@/features/tickets/store/ticketStore'
import type { Status } from '@/types/ticket'

const OPTIONS = STATUS_VALUES.map((value) => ({ value, label: STATUS_META[value].label }))

interface StatusSelectProps {
  ticketId: string
  status: Status
  /** Rows and cards open the panel on click; the panel itself has nothing to stop. */
  stopRowActivation?: boolean
}

export default function StatusSelect({
  ticketId,
  status,
  stopRowActivation = false,
}: StatusSelectProps) {
  const updateStatus = useTicketStore((state) => state.updateStatus)

  // Without this the control's own click and Enter/Space bubble to the row and
  // open the detail panel while you are trying to change the status.
  const stop = stopRowActivation
    ? { onClick: (e: React.MouseEvent) => e.stopPropagation(), onKeyDown: (e: React.KeyboardEvent) => e.stopPropagation() }
    : {}

  return (
    // A div, not a span: Select renders a div, which is invalid inside a span.
    // flex-1 lets the control take its width from the column it sits in -
    // shrink-to-fit sized it to the longest option and clipped "In progress".
    <div className="flex items-center gap-2" {...stop}>
      <Dot className={STATUS_META[status].dotClass} />
      <div className="min-w-0 flex-1">
        <Select
          aria-label={`Status for ticket ${ticketId}`}
          variant={stopRowActivation ? 'ghost' : 'default'}
          value={status}
          options={OPTIONS}
          onChange={(event) => updateStatus(ticketId, event.target.value as Status)}
        />
      </div>
    </div>
  )
}
