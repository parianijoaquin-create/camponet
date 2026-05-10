import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Plus, Package, Truck, CheckCircle, DollarSign, AlertTriangle } from 'lucide-react'
import MetricCard from '../../components/MetricCard'
import TripCard from '../../components/TripCard'
import EmptyState from '../../components/EmptyState'
import StatusBadge from '../../components/StatusBadge'
import { formatARS } from '../../lib/format'

export default function ProducerDashboard() {
  const { state } = useApp()
  const navigate = useNavigate()

  const myTrips = state.trips.filter(t => t.producerId === 'p1')
  const active = myTrips.filter(t => t.status === 'asignado' || t.status === 'en_camino')
  const pending = myTrips.filter(t => t.status === 'pendiente')
  const done = myTrips.filter(t => t.status === 'entregado')
  const totalCost = myTrips.reduce((s, t) => s + (t.estimatedCost || 0), 0)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Buen día, Martín</h1>
          <p className="text-slate-500 text-sm mt-0.5">Estancia La Esperanza · Río Cuarto, Córdoba</p>
        </div>
        <button onClick={() => navigate('/productor/solicitar')} className="btn-primary flex-shrink-0 w-full sm:w-auto justify-center">
          <Plus size={16} />
          Solicitar transporte
        </button>
      </div>

      {/* Alert for pending trips */}
      {pending.length > 0 && (
        <div className="mb-6 flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-xl p-4">
          <AlertTriangle size={18} className="text-orange-500 flex-shrink-0" />
          <div className="text-sm text-orange-800">
            Tenés <strong>{pending.length} viaje{pending.length > 1 ? 's' : ''}</strong> sin transportista asignado.{' '}
            <button
              onClick={() => navigate(`/productor/buscar/${pending[0].id}`)}
              className="font-semibold underline"
            >
              Buscar transportista
            </button>
          </div>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard icon={Truck} label="Viajes activos" value={active.length} delta="+2" color="text-blue-600" bg="bg-blue-50" />
        <MetricCard icon={Package} label="Sin asignar" value={pending.length} color="text-orange-500" bg="bg-orange-50" />
        <MetricCard icon={CheckCircle} label="Entregados" value={done.length} delta="+1" />
        <MetricCard icon={DollarSign} label="Costo estimado" value={formatARS(totalCost)} color="text-slate-600" bg="bg-slate-100" />
      </div>

      {/* Active trips */}
      {active.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-base font-bold text-slate-900">Viajes activos</h2>
            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">{active.length}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {active.map(trip => <TripCard key={trip.id} trip={trip} />)}
          </div>
        </section>
      )}

      {/* Pending trips */}
      {pending.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-base font-bold text-slate-900">Pendientes de asignación</h2>
            <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-0.5 rounded-full">{pending.length}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pending.map(trip => (
              <div key={trip.id} className="relative">
                <TripCard trip={trip} />
                <div className="absolute bottom-4 right-4">
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/productor/buscar/${trip.id}`) }}
                    className="btn-orange text-xs py-1.5 px-3"
                  >
                    Buscar transportista
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* No trips */}
      {myTrips.length === 0 && (
        <EmptyState
          icon={Package}
          title="No tenés viajes registrados"
          description="Creá tu primera solicitud de transporte para empezar."
          action={
            <button onClick={() => navigate('/productor/solicitar')} className="btn-primary">
              <Plus size={16} /> Solicitar transporte
            </button>
          }
        />
      )}

      {/* History */}
      {done.length > 0 && (
        <section>
          <h2 className="text-base font-bold text-slate-900 mb-4">Historial de viajes</h2>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Ruta</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Carga</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Estado</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Costo</th>
                </tr>
              </thead>
              <tbody>
                {done.map((trip) => (
                  <tr
                    key={trip.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer"
                    onClick={() => navigate(`/productor/viaje/${trip.id}`)}
                  >
                    <td className="px-4 py-3 text-xs text-slate-400 font-mono">{trip.id.toUpperCase()}</td>
                    <td className="px-4 py-3 text-slate-700">{trip.origin} → {trip.destination}</td>
                    <td className="px-4 py-3 text-slate-500 capitalize hidden md:table-cell">{trip.cargoType}</td>
                    <td className="px-4 py-3 hidden sm:table-cell"><StatusBadge status={trip.status} size="sm" /></td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-900">{formatARS(trip.estimatedCost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}
