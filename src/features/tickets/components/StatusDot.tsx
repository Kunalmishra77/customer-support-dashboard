import Dot from '@/components/ui/Dot'
import { STATUS_META } from '@/lib/constants'
import type { Status } from '@/types/ticket'

interface StatusDotProps {
  status: Status
}

/**
 * Lives in the feature folder, not components/ui: it maps ticket statuses to
 * colours, which is domain knowledge a generic primitive must not carry.
 */
export default function StatusDot({ status }: StatusDotProps) {
  const { label, dotClass } = STATUS_META[status]

  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap text-ink">
      <Dot className={dotClass} />
      {label}
    </span>
  )
}
