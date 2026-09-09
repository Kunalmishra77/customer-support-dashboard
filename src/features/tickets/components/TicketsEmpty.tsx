import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'

interface TicketsEmptyProps {
  variant: 'no-tickets' | 'no-results'
  onClearFilters: () => void
}

export default function TicketsEmpty({ variant, onClearFilters }: TicketsEmptyProps) {
  return (
    <div className="rounded-surface border border-line bg-surface">
      {variant === 'no-tickets' ? (
        <EmptyState message="There are no tickets in the queue." />
      ) : (
        <EmptyState
          message="No tickets match these filters."
          action={
            <Button variant="secondary" onClick={onClearFilters}>
              Clear filters
            </Button>
          }
        />
      )}
    </div>
  )
}
