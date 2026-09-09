import { cn } from '@/lib/cn'

type Size = 'sm' | 'md'

interface AvatarProps {
  name: string
  size?: Size
  className?: string
}

const SIZES: Record<Size, string> = {
  sm: 'h-6 w-6 text-xs',
  md: 'h-8 w-8 text-xs',
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
  return (first + last).toUpperCase()
}

/** Initials, never a remote image: an avatar service is the thing that is down on review day. */
export default function Avatar({ name, size = 'md', className }: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full',
        'bg-accent-tint font-semibold text-accent',
        SIZES[size],
        className,
      )}
    >
      {getInitials(name)}
    </span>
  )
}
