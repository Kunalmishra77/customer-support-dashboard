import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Tone = 'neutral' | 'danger' | 'warning' | 'success'

interface BadgeProps {
  tone?: Tone
  className?: string
  children: ReactNode
}

/** Knows about tones, not about priorities. The feature layer maps one to the other. */
const TONES: Record<Tone, string> = {
  neutral: 'bg-surface-sunken text-muted',
  danger: 'bg-prio-high-tint text-prio-high-text',
  warning: 'bg-prio-medium-tint text-prio-medium-text',
  success: 'bg-surface-sunken text-success',
}

export default function Badge({ tone = 'neutral', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-control px-2 py-0.5 text-xs font-medium',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
