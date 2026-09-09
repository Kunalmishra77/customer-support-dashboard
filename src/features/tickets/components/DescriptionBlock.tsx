import TicketTags from '@/features/tickets/components/TicketTags'

interface DescriptionBlockProps {
  description: string
  tags: string[]
}

export default function DescriptionBlock({ description, tags }: DescriptionBlockProps) {
  return (
    <section className="border-b border-line p-4 md:p-6">
      <h3 className="text-[15px] font-semibold leading-[22px]">Issue</h3>
      <p className="mt-2 max-w-[68ch] break-words text-[15px] leading-6">{description}</p>
      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <TicketTags tags={tags} />
        </div>
      )}
    </section>
  )
}
