import { X } from 'lucide-react'
import IconButton from '@/components/ui/IconButton'
import { cn } from '@/lib/cn'

type Tone = 'danger' | 'success'

interface ToastProps {
  message: string
  tone?: Tone
  onDismiss: () => void
}

const TONES: Record<Tone, string> = {
  danger: 'border-l-danger',
  success: 'border-l-success',
}

export default function Toast({ message, tone = 'danger', onDismiss }: ToastProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-control border border-line border-l-4 bg-surface py-2 pl-4 pr-2',
        TONES[tone],
      )}
    >
      <p className="flex-1">{message}</p>
      <IconButton label="Dismiss" onClick={onDismiss}>
        <X size={16} />
      </IconButton>
    </div>
  )
}
