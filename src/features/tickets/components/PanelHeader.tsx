import { X } from 'lucide-react'
import IconButton from '@/components/ui/IconButton'

interface PanelHeaderProps {
  ticketId: string
  subject: string
  titleId: string
  onClose: () => void
}

export default function PanelHeader({ ticketId, subject, titleId, onClose }: PanelHeaderProps) {
  return (
    <div className="flex items-start gap-4 border-b border-line p-4 md:p-6">
      <div className="min-w-0 flex-1">
        <p className="tnum text-xs font-medium text-muted">{ticketId}</p>
        <h2 id={titleId} className="mt-1 text-xl font-semibold leading-7">
          {subject}
        </h2>
      </div>
      <IconButton label="Close panel" onClick={onClose}>
        <X size={16} />
      </IconButton>
    </div>
  )
}
