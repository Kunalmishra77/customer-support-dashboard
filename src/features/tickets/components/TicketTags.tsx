interface TicketTagsProps {
  tags: string[]
  /** Rows show a couple; the panel shows them all. */
  limit?: number
}

export default function TicketTags({ tags, limit }: TicketTagsProps) {
  const shown = limit ? tags.slice(0, limit) : tags
  if (shown.length === 0) return null

  return (
    <>
      {shown.map((tag) => (
        <span
          key={tag}
          className="rounded-control bg-surface-sunken px-2 text-xs leading-5 text-muted"
        >
          {tag}
        </span>
      ))}
    </>
  )
}
