import { cn } from '@/lib/cn'

interface DotProps {
  /** Background colour class, e.g. "bg-status-open". */
  className?: string
}

/** A 6px circle. Generic on purpose: it carries no meaning of its own. */
export default function Dot({ className }: DotProps) {
  return (
    <span
      aria-hidden="true"
      className={cn('inline-block h-1.5 w-1.5 shrink-0 rounded-full', className)}
    />
  )
}
