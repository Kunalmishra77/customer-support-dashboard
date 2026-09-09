import Avatar from '@/components/ui/Avatar'
import type { Customer } from '@/types/ticket'

interface CustomerBlockProps {
  customer: Customer
}

export default function CustomerBlock({ customer }: CustomerBlockProps) {
  return (
    <div className="flex items-start gap-3 border-b border-line p-4 md:p-6">
      <Avatar name={customer.name} />
      {/* Three lines rather than one: at 440px a single line truncates away the
          plan, which R12 asks for. */}
      <div className="min-w-0">
        <p className="truncate font-medium">{customer.name}</p>
        <p className="truncate text-muted" title={customer.email}>
          {customer.email}
        </p>
        <p className="mt-1 truncate text-xs text-muted">
          {customer.company} &middot; {customer.plan}
        </p>
      </div>
    </div>
  )
}
