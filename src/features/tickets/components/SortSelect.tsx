import Select from '@/components/ui/Select'
import { useTicketFilters } from '@/features/tickets/hooks/useTicketFilters'

const OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'priority', label: 'Priority' },
]

export default function SortSelect() {
  const { filters, setFilter } = useTicketFilters()

  return (
    <Select
      aria-label="Sort tickets"
      value={filters.sort}
      options={OPTIONS}
      onChange={(event) => setFilter('sort', event.target.value)}
    />
  )
}
