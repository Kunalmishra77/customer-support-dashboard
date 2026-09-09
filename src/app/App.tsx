import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from '@/app/AppShell'
import DashboardPage from '@/app/DashboardPage'
import TicketDetailPanel from '@/features/tickets/components/TicketDetailPanel'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<DashboardPage />}>
          {/* Nested under "/" so DashboardPage stays mounted: closing the panel
              does not refetch the queue or lose the list's scroll position. */}
          <Route path="tickets/:id" element={<TicketDetailPanel />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
