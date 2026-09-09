import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leadingIcon?: ReactNode
}

export default function Input({ leadingIcon, className, ...rest }: InputProps) {
  return (
    <div className="relative">
      {leadingIcon && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        >
          {leadingIcon}
        </span>
      )}
      <input
        className={cn(
          // 44px touch target on mobile per design system section 4; the
          // specified 36px control height applies from md up.
          'h-11 w-full rounded-control border border-line bg-surface text-ink md:h-9',
          'placeholder:text-muted transition-colors duration-[120ms] hover:border-muted/40',
          leadingIcon ? 'pl-9 pr-3' : 'px-3',
          className,
        )}
        {...rest}
      />
    </div>
  )
}
