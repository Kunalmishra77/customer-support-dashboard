import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from '@/app/AppShell'
import DashboardPage from '@/app/DashboardPage'
import KitchenSinkPage from '@/app/KitchenSinkPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<DashboardPage />}>
          {/* The detail panel mounts here in Phase 4. Nesting it under "/" keeps
              DashboardPage mounted, so closing the panel does not refetch the queue. */}
          <Route path="tickets/:id" element={null} />
        </Route>
        {/* Temporary: removed at the end of Phase 1 / in Phase 6 cleanup. */}
        <Route path="/kitchen-sink" element={<KitchenSinkPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
