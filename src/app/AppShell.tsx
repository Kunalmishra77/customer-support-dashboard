import { Outlet } from 'react-router-dom'

const AGENT_NAME = 'Aditi Sharma'
const AGENT_INITIALS = 'AS'

export default function AppShell() {
  return (
    <div className="min-h-screen">
      <header className="h-14 border-b border-line bg-surface">
        <div className="mx-auto flex h-full max-w-[1200px] items-center gap-6 px-4 md:px-6">
          <span className="font-semibold text-ink">Ledgerly Support</span>
          <span className="text-muted">Tickets</span>
          <div className="ml-auto flex items-center gap-2">
            <span
              aria-hidden="true"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-tint text-xs font-semibold text-accent"
            >
              {AGENT_INITIALS}
            </span>
            <span className="hidden text-muted sm:inline">{AGENT_NAME}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-4 py-6 md:px-6">
        <Outlet />
      </main>
    </div>
  )
}
