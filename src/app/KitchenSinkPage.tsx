import { Search, X } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Dot from '@/components/ui/Dot'
import EmptyState from '@/components/ui/EmptyState'
import IconButton from '@/components/ui/IconButton'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Skeleton from '@/components/ui/Skeleton'
import StatusDot from '@/features/tickets/components/StatusDot'
import { CHANNEL_LABEL, PRIORITY_META, PRIORITY_VALUES, STATUS_VALUES } from '@/lib/constants'
import { formatAbsolute, formatRelative } from '@/lib/date'
import type { Channel } from '@/types/ticket'

// Temporary: deleted at the end of Phase 1 / in Phase 6 cleanup.

const NOW = Date.now()
const SAMPLE_DATES = [
  new Date(NOW - 30_000).toISOString(),
  new Date(NOW - 45 * 60_000).toISOString(),
  new Date(NOW - 2 * 3_600_000).toISOString(),
  new Date(NOW - 3 * 86_400_000).toISOString(),
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-surface border border-line bg-surface p-6">
      <h2 className="mb-4 text-[15px] font-semibold">{title}</h2>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </section>
  )
}

export default function KitchenSinkPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">Kitchen sink</h1>

      <Section title="Button">
        <Button variant="primary">Mark resolved</Button>
        <Button variant="secondary">Clear filters</Button>
        <Button variant="ghost">Retry</Button>
        <Button variant="primary" size="sm">Small primary</Button>
        <Button variant="secondary" size="sm">Small secondary</Button>
        <Button variant="primary" disabled>Disabled</Button>
      </Section>

      <Section title="IconButton">
        <IconButton label="Close panel"><X size={16} /></IconButton>
        <IconButton label="Disabled close" disabled><X size={16} /></IconButton>
      </Section>

      <Section title="Input and Select">
        <div className="w-64">
          <Input placeholder="Search tickets" leadingIcon={<Search size={16} />} />
        </div>
        <div className="w-48">
          <Input placeholder="No icon" />
        </div>
        <div className="w-40">
          <Select
            defaultValue="all"
            options={[
              { value: 'all', label: 'All statuses' },
              ...STATUS_VALUES.map((s) => ({ value: s, label: s })),
            ]}
          />
        </div>
      </Section>

      <Section title="Badge tones">
        <Badge tone="neutral">Neutral</Badge>
        <Badge tone="danger">Danger</Badge>
        <Badge tone="warning">Warning</Badge>
        <Badge tone="success">Success</Badge>
      </Section>

      <Section title="Priority meta (feature layer maps to tone classes)">
        {PRIORITY_VALUES.map((priority) => (
          <span key={priority} className="inline-flex items-center gap-2">
            <span className={`h-6 w-[3px] rounded-full ${PRIORITY_META[priority].ruleClass}`} />
            <span
              className={`inline-flex items-center rounded-control px-2 py-0.5 text-xs font-medium ${PRIORITY_META[priority].tagClass}`}
            >
              {PRIORITY_META[priority].label}
            </span>
          </span>
        ))}
      </Section>

      <Section title="StatusDot and Dot">
        {STATUS_VALUES.map((status) => (
          <StatusDot key={status} status={status} />
        ))}
        <span className="ml-4 inline-flex items-center gap-2 text-muted">
          <Dot className="bg-muted" /> generic Dot
        </span>
      </Section>

      <Section title="Avatar">
        <Avatar name="Priya Nair" size="sm" />
        <Avatar name="Priya Nair" />
        <Avatar name="Marcus Webb" />
        <Avatar name="Cher" />
      </Section>

      <Section title="Skeleton (sized to real elements)">
        <div className="w-full max-w-md space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-64" />
          <Skeleton className="h-[30px] w-16" />
        </div>
      </Section>

      <Section title="Dates">
        <ul className="tnum space-y-1">
          {SAMPLE_DATES.map((iso) => (
            <li key={iso}>
              <span className="font-medium">{formatRelative(iso)}</span>
              <span className="text-muted"> - {formatAbsolute(iso)}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Channel labels">
        {(Object.keys(CHANNEL_LABEL) as Channel[]).map((channel) => (
          <Badge key={channel}>{CHANNEL_LABEL[channel]}</Badge>
        ))}
      </Section>

      <section className="rounded-surface border border-line bg-surface">
        <h2 className="border-b border-line p-6 pb-4 text-[15px] font-semibold">EmptyState</h2>
        <EmptyState
          message="No tickets match these filters."
          action={<Button variant="secondary">Clear filters</Button>}
        />
      </section>
    </div>
  )
}
