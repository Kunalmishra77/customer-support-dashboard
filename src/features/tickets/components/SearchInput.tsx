import { Search } from 'lucide-react'
import Input from '@/components/ui/Input'
import { useSearchInput } from '@/features/tickets/hooks/useTicketFilters'

export default function SearchInput() {
  const { value, setValue } = useSearchInput()

  return (
    <Input
      type="text"
      aria-label="Search tickets"
      placeholder="Search tickets"
      leadingIcon={<Search size={16} />}
      value={value}
      onChange={(event) => setValue(event.target.value)}
    />
  )
}
