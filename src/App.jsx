import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import AppShell from './layouts/AppShell'
import Login from './pages/Login'
import ProducerDashboard from './pages/producer/Dashboard'
import RequestTransport from './pages/producer/RequestTransport'
import SearchResults from './pages/producer/SearchResults'
import TripTracking from './pages/producer/TripTracking'
import TransporterDashboard from './pages/transporter/Dashboard'
import TransporterProfile from './pages/transporter/Profile'
import AdminDashboard from './pages/admin/Dashboard'
import News from './pages/shared/News'
import ToastContainer from './components/ToastContainer'

function RoleRouter() {
  const { state } = useApp()
  const { role } = state

  if (!role) return <Login />

  return (
    <AppShell>
      <Routes>
        {role === 'producer' && (
          <>
            <Route path="/" element={<ProducerDashboard />} />
            <Route path="/productor" element={<ProducerDashboard />} />
            <Route path="/productor/solicitar" element={<RequestTransport />} />
            <Route path="/productor/buscar/:requestId" element={<SearchResults />} />
            <Route path="/productor/viaje/:id" element={<TripTracking />} />
            <Route path="/productor/noticias" element={<News />} />
            <Route path="*" element={<Navigate to="/productor" replace />} />
          </>
        )}
        {role === 'transporter' && (
          <>
            <Route path="/" element={<TransporterDashboard />} />
            <Route path="/transportista" element={<TransporterDashboard />} />
            <Route path="/transportista/perfil" element={<TransporterProfile />} />
            <Route path="/transportista/noticias" element={<News />} />
            <Route path="/productor/viaje/:id" element={<TripTracking />} />
            <Route path="*" element={<Navigate to="/transportista" replace />} />
          </>
        )}
        {role === 'admin' && (
          <>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/noticias" element={<News />} />
            <Route path="/productor/viaje/:id" element={<TripTracking />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </>
        )}
      </Routes>
    </AppShell>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <RoleRouter />
        <ToastContainer />
      </BrowserRouter>
    </AppProvider>
  )
}
