import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from '@/app/AppShell'
import DashboardPage from '@/app/DashboardPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<DashboardPage />}>
          {/* The detail panel mounts here in Phase 4. Nesting it under "/" keeps
              DashboardPage mounted, so closing the panel does not refetch the queue. */}
          <Route path="tickets/:id" element={null} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
