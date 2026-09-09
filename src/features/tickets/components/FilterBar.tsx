import Button from '@/components/ui/Button'
import PriorityFilter from '@/features/tickets/components/PriorityFilter'
import SearchInput from '@/features/tickets/components/SearchInput'
import SortSelect from '@/features/tickets/components/SortSelect'
import StatusFilter from '@/features/tickets/components/StatusFilter'
import { useTicketFilters } from '@/features/tickets/hooks/useTicketFilters'

export default function FilterBar() {
  const { clearFilters, hasActiveFilters } = useTicketFilters()

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <div className="md:w-72">
        <SearchInput />
      </div>

      <div className="flex items-center gap-3">
        <StatusFilter />
        <div className="w-full md:w-40">
          <PriorityFilter />
        </div>
      </div>

      <div className="w-full md:ml-auto md:w-44">
        <SortSelect />
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" onClick={clearFilters}>
          Clear filters
        </Button>
      )}
    </div>
  )
}
