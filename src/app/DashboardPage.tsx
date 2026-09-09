import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import FilterBar from '@/features/tickets/components/FilterBar'
import QueueSummary from '@/features/tickets/components/QueueSummary'
import TicketList from '@/features/tickets/components/TicketList'
import ToastViewport from '@/features/tickets/components/ToastViewport'
import { useTicketStore } from '@/features/tickets/store/ticketStore'

export default function DashboardPage() {
  const fetchTickets = useTicketStore((state) => state.fetchTickets)

  useEffect(() => {
    const controller = new AbortController()
    fetchTickets(controller.signal)
    // Aborting on cleanup stops StrictMode's first, discarded run from landing.
    return () => controller.abort()
  }, [fetchTickets])

  return (
    <div className="flex flex-col gap-6">
      <QueueSummary />
      <FilterBar />
      <TicketList />
      <Outlet />
      <ToastViewport />
    </div>
  )
}
