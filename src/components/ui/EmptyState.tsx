import type { ReactNode } from 'react'

interface EmptyStateProps {
  message: string
  action?: ReactNode
}

/** One line of direction and a way out. No illustration by design. */
export default function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 px-4 py-12 text-center">
      <p className="text-muted">{message}</p>
      {action}
    </div>
  )
}
