import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { ArrowLeft } from 'lucide-react'
import TransporterCard from '../../components/TransporterCard'
import { TRANSPORTERS } from '../../data/seed'
import EmptyState from '../../components/EmptyState'
import { Truck } from 'lucide-react'

export default function SearchResults() {
  const { requestId } = useParams()
  const { state, dispatch, toast } = useApp()
  const navigate = useNavigate()

  // Find the trip: if 'new', take the most recently created pendiente; else by id
  const trip = requestId === 'new'
    ? state.trips.find(t => t.status === 'pendiente' && t.producerId === 'p1')
    : state.trips.find(t => t.id === requestId)

  if (!trip) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <EmptyState icon={Truck} title="No se encontró la solicitud" description="Volvé al dashboard para ver tus viajes." action={<button onClick={() => navigate('/productor')} className="btn-primary">Ir al dashboard</button>} />
      </div>
    )
  }

  // Rank transporters: filter by capacity, sort by rating desc
  const candidates = [...TRANSPORTERS]
    .filter(t => t.capacityTons >= trip.weightTons * 0.85)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4)

  const assign = (transporter) => {
    const cost = Math.round(trip.distanceKm * trip.weightTons * transporter.pricePerKm / 30)
    dispatch({ type: 'ASSIGN_TRANSPORTER', tripId: trip.id, transporterId: transporter.id, estimatedCost: cost })
    toast(`Viaje asignado a ${transporter.name} ✓`)
    setTimeout(() => navigate(`/productor/viaje/${trip.id}`), 800)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-900">Transportistas disponibles</h1>
          <p className="text-sm text-slate-500">
            {trip.origin} → {trip.destination} · {trip.distanceKm} km · {trip.weightTons} t de {trip.cargoType}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-campo-700 bg-campo-50 border border-campo-200 rounded-full px-3 py-1.5">
          <span className="w-2 h-2 bg-campo-500 rounded-full animate-pulse" />
          {candidates.length} disponibles
        </div>
      </div>

      {/* Trip summary card */}
      <div className="card p-4 mb-6 flex flex-wrap gap-4">
        {[
          { label: 'Tipo de carga', value: trip.cargoType },
          { label: 'Distancia', value: `${trip.distanceKm} km` },
          { label: 'Peso', value: `${trip.weightTons} t` },
          { label: 'Fecha requerida', value: trip.requiredDate },
        ].map(item => (
          <div key={item.label} className="flex-1 min-w-24">
            <div className="text-xs text-slate-400">{item.label}</div>
            <div className="text-sm font-semibold text-slate-800 capitalize">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {candidates.map((transporter) => {
          const isAssigned = trip.transporterId === transporter.id
          return (
            <TransporterCard
              key={transporter.id}
              transporter={transporter}
              distanceKm={trip.distanceKm}
              weightTons={trip.weightTons}
              onAssign={() => assign(transporter)}
              assigned={isAssigned || trip.status !== 'pendiente'}
            />
          )
        })}
      </div>

      {trip.status !== 'pendiente' && (
        <div className="mt-6 card p-4 bg-campo-50 border-campo-200 flex items-center justify-between">
          <span className="text-sm text-campo-700 font-medium">Este viaje ya tiene transportista asignado.</span>
          <button onClick={() => navigate(`/productor/viaje/${trip.id}`)} className="btn-primary text-sm">
            Ver seguimiento →
          </button>
        </div>
      )}
    </div>
  )
}
