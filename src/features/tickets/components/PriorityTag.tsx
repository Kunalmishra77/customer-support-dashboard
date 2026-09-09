import type { ComponentProps } from 'react'
import Badge from '@/components/ui/Badge'
import { PRIORITY_META } from '@/lib/constants'
import type { Priority } from '@/types/ticket'

type Tone = ComponentProps<typeof Badge>['tone']

// The one indirection that keeps Badge reusable: Badge knows tones, this knows
// that a high-priority ticket is a danger tone.
const TONE: Record<Priority, Tone> = {
  high: 'danger',
  medium: 'warning',
  low: 'neutral',
}

interface PriorityTagProps {
  priority: Priority
}

export default function PriorityTag({ priority }: PriorityTagProps) {
  return <Badge tone={TONE[priority]}>{PRIORITY_META[priority].label}</Badge>
}
