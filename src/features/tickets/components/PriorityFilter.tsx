import Select from '@/components/ui/Select'
import { PRIORITY_META, PRIORITY_VALUES } from '@/lib/constants'
import { useTicketFilters } from '@/features/tickets/hooks/useTicketFilters'

const OPTIONS = [
  { value: 'all', label: 'All priorities' },
  ...PRIORITY_VALUES.map((value) => ({ value, label: PRIORITY_META[value].label })),
]

export default function PriorityFilter() {
  const { filters, setFilter } = useTicketFilters()

  return (
    <Select
      aria-label="Filter by priority"
      value={filters.priority}
      options={OPTIONS}
      onChange={(event) => setFilter('priority', event.target.value)}
    />
  )
}
