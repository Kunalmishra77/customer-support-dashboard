import { cn } from '@/lib/cn'
import { formatAbsolute } from '@/lib/date'
import type { Message } from '@/types/ticket'

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const fromAgent = message.author.role === 'agent'

  return (
    <li className={cn('flex flex-col', fromAgent ? 'items-end' : 'items-start')}>
      <p className="text-xs text-muted">
        {message.author.name} &middot; {formatAbsolute(message.sentAt)}
      </p>
      {/* No avatars in the thread: at this density the names carry it. */}
      <div
        className={cn(
          'mt-1 max-w-[68ch] rounded-surface border px-4 py-3 text-[15px] leading-6',
          fromAgent ? 'border-line bg-surface-sunken' : 'border-line bg-surface',
        )}
      >
        <p className="break-words">{message.body}</p>
      </div>
    </li>
  )
}
