import Skeleton from '@/components/ui/Skeleton'

const ROWS = [0, 1, 2, 3, 4, 5]

/** Sized to the real row: 56px tall, same column widths, so nothing jumps on load. */
export default function TicketListSkeleton() {
  return (
    <div className="overflow-hidden rounded-surface border border-line bg-surface">
      <div className="hidden h-9 border-b border-line bg-surface-sunken md:block" />
      {ROWS.map((row) => (
        <div
          key={row}
          className="flex h-14 items-center gap-4 border-b border-line px-4 last:border-b-0"
        >
          <div className="min-w-0 flex-1 space-y-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-48 md:w-64" />
          </div>
          <Skeleton className="hidden h-5 w-24 md:block" />
          <Skeleton className="hidden h-5 w-16 md:block" />
        </div>
      ))}
    </div>
  )
}
