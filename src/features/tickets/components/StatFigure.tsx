import Skeleton from '@/components/ui/Skeleton'

interface StatFigureProps {
  label: string
  /** null when the count is genuinely unknown, i.e. the request failed. */
  value: number | null
  loading: boolean
}

export default function StatFigure({ label, value, loading }: StatFigureProps) {
  return (
    <div className="bg-surface p-4 md:p-6">
      {/* Never render 0 while loading or after a failure: a zero is a claim that
          there are no tickets, which is not what either state knows. */}
      {loading ? (
        <Skeleton className="h-[34px] w-12" />
      ) : (
        <p className="tnum text-[30px] font-semibold leading-[34px]">
          {value === null ? <span className="text-muted">&mdash;</span> : value}
        </p>
      )}
      <p className="mt-1 text-xs font-medium text-muted">{label}</p>
    </div>
  )
}
