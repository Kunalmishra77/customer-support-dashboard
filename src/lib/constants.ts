import type { Channel, Priority, Status } from '@/types/ticket'

/**
 * Machine values are what we store and compare. Everything a human reads comes
 * from these maps, so a label change never turns into a broken comparison.
 */
export const STATUS_META: Record<Status, { label: string; dotClass: string }> = {
  open: { label: 'Open', dotClass: 'bg-status-open' },
  in_progress: { label: 'In progress', dotClass: 'bg-status-progress' },
  resolved: { label: 'Resolved', dotClass: 'bg-status-resolved' },
}

export const PRIORITY_META: Record<
  Priority,
  { label: string; ruleClass: string; tagClass: string }
> = {
  high: {
    label: 'High',
    ruleClass: 'bg-prio-high',
    tagClass: 'bg-prio-high-tint text-prio-high-text',
  },
  medium: {
    label: 'Medium',
    ruleClass: 'bg-prio-medium',
    tagClass: 'bg-prio-medium-tint text-prio-medium-text',
  },
  // Low has no tint by design: the rule stays present but silent so row text
  // aligns identically across priorities.
  low: {
    label: 'Low',
    ruleClass: 'bg-line',
    tagClass: 'border border-line text-muted',
  },
}

export const CHANNEL_LABEL: Record<Channel, string> = {
  email: 'Email',
  chat: 'Chat',
  phone: 'Phone',
}

export const STATUS_VALUES = ['open', 'in_progress', 'resolved'] as const
export const PRIORITY_VALUES = ['high', 'medium', 'low'] as const
