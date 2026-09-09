import Select from '@/components/ui/Select'
import { cn } from '@/lib/cn'
import { STATUS_META, STATUS_VALUES } from '@/lib/constants'
import { useTicketFilters } from '@/features/tickets/hooks/useTicketFilters'

const OPTIONS = [
  { value: 'all', label: 'All statuses' },
  ...STATUS_VALUES.map((value) => ({ value, label: STATUS_META[value].label })),
]

export default function StatusFilter() {
  const { filters, setFilter } = useTicketFilters()

  return (
    <>
      {/* Segmented on desktop where the room exists, a native select on mobile. */}
      <div
        role="group"
        aria-label="Filter by status"
        className="hidden h-9 divide-x divide-line overflow-hidden rounded-control border border-line bg-surface md:flex"
      >
        {OPTIONS.map((option) => {
          const selected = filters.status === option.value
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => setFilter('status', option.value)}
              className={cn(
                'px-3 font-medium transition-colors duration-[120ms]',
                selected ? 'bg-accent-tint text-accent' : 'text-muted hover:text-ink',
              )}
            >
              {option.value === 'all' ? 'All' : option.label}
            </button>
          )
        })}
      </div>

      <div className="w-full md:hidden">
        <Select
          aria-label="Filter by status"
          value={filters.status}
          options={OPTIONS}
          onChange={(event) => setFilter('status', event.target.value)}
        />
      </div>
    </>
  )
}
