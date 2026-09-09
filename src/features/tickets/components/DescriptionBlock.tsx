interface DescriptionBlockProps {
  description: string
}

export default function DescriptionBlock({ description }: DescriptionBlockProps) {
  return (
    <section className="border-b border-line p-4 md:p-6">
      <h3 className="text-[15px] font-semibold leading-[22px]">Issue</h3>
      <p className="mt-2 max-w-[68ch] break-words text-[15px] leading-6">{description}</p>
    </section>
  )
}
