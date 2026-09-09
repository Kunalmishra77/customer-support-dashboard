import MessageBubble from '@/features/tickets/components/MessageBubble'
import type { Message } from '@/types/ticket'

interface MessageListProps {
  messages: Message[]
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <section className="p-4 md:p-6">
      <h3 className="text-[15px] font-semibold leading-[22px]">Conversation</h3>
      {messages.length === 0 ? (
        <p className="mt-2 text-muted">No messages on this ticket yet.</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </ul>
      )}
    </section>
  )
}
