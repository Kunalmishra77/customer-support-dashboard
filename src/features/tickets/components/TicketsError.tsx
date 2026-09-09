import Button from '@/components/ui/Button'

interface TicketsErrorProps {
  message: string
  onRetry: () => void
}

export default function TicketsError({ message, onRetry }: TicketsErrorProps) {
  return (
    <div className="rounded-surface border border-line bg-surface">
      <div className="flex flex-col items-center gap-4 px-4 py-12 text-center">
        <p className="text-muted">{message}</p>
        <Button variant="secondary" onClick={onRetry}>
          Retry
        </Button>
      </div>
    </div>
  )
}
