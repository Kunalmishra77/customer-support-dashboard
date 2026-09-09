import { Outlet } from 'react-router-dom'

// Placeholder for Phase 0 only — replaced by QueueSummary, FilterBar and
// TicketList in Phase 3. Exists now so the route structure is verifiable.
export default function DashboardPage() {
  return (
    <>
      <div className="rounded-surface border border-line bg-surface p-6">
        <h1 className="text-xl font-semibold">Scaffold check</h1>
        <p className="mt-2 text-muted">
          White surface on the grey canvas, IBM Plex Sans, 1px line border.
        </p>
        <p className="tnum mt-4 text-3xl font-semibold">1234567890</p>
      </div>
      <Outlet />
    </>
  )
}
