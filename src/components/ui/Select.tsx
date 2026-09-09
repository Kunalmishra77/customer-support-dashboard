import type { SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

interface SelectOption {
  value: string
  label: string
}

type Variant = 'default' | 'ghost'

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: SelectOption[]
  variant?: Variant
}

// A variant prop rather than an overriding className: two competing border
// utilities would resolve by stylesheet order, which the caller cannot control.
const VARIANTS: Record<Variant, string> = {
  default: 'border-line bg-surface hover:border-muted/40',
  ghost: 'border-transparent bg-transparent hover:border-line hover:bg-surface',
}

/**
 * A native <select> on purpose: it gets the platform picker on mobile and full
 * keyboard support for free, which a custom listbox would have to reimplement.
 */
export default function Select({ options, variant = 'default', className, ...rest }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          'h-9 w-full cursor-pointer appearance-none rounded-control border',
          'pl-3 pr-8 text-ink transition-colors duration-[120ms]',
          VARIANTS[variant],
          className,
        )}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        size={16}
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted"
      />
    </div>
  )
}
