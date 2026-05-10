import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { DollarSign, Truck, CheckCircle, Clock, MapPin, ArrowRight, Package, Star, Fuel, Flame } from 'lucide-react'
import StatusBadge from '../../components/StatusBadge'

function StatTile({ icon: Icon, label, value, delta, gradient, iconBg }) {
  return (
    <div className={`rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-2 shadow-sm border border-white/20 ${gradient}`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <Icon size={21} className="text-white" />
      </div>
      <div className="text-2xl font-extrabold text-white leading-tight tracking-tight">{value}</div>
      <div className="text-xs font-medium text-white/80 leading-snug">{label}</div>
      {delta && (
        <div className="text-xs font-semibold bg-white/20 text-white rounded-full px-2.5 py-0.5">{delta} este mes</div>
      )}
    </div>
  )
}
import EmptyState from '../../components/EmptyState'
import { formatARS, formatDate } from '../../lib/format'
import { TRANSPORTERS } from '../../data/seed'

const TABS = ['Disponibles', 'Aceptados', 'Historial']
const CARGO_ICONS = { granos: '🌾', semillas: '🌱', fertilizantes: '🧪', agroquimicos: '⚗️', otros: '📦' }

export default function TransporterDashboard() {
  const { state, dispatch, toast } = useApp()
  const navigate = useNavigate()
  const [tab, setTab] = useState(0)

  const me = TRANSPORTERS[0] // Juan Pérez — t1

  const available = state.trips.filter(t => t.status === 'pendiente')
  const accepted  = state.trips.filter(t => t.transporterId === me.id && (t.status === 'asignado' || t.status === 'en_camino'))
  const history   = state.trips.filter(t => t.transporterId === me.id && t.status === 'entregado')

  const totalEarnings = [...accepted, ...history].reduce((s, t) => s + (t.estimatedCost || 0) * 0.72, 0)

  const totalKm       = [...accepted, ...history].reduce((s, t) => s + (t.distanceKm || 0), 0)
  const litrosGastados = Math.round(totalKm * 35 / 100)
  const costoCombustible = litrosGastados * 2000

  const acceptTrip = (trip) => {
    dispatch({ type: 'TRANSPORTER_ACCEPT', tripId: trip.id, transporterId: me.id })
    toast(`Viaje aceptado: ${trip.origin} → ${trip.destination}`)
  }

  function TripRow({ trip, showAccept }) {
    return (
      <div
        className="card p-4 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => navigate(`/productor/viaje/${trip.id}`)}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{CARGO_ICONS[trip.cargoType] || '📦'}</span>
            <div>
              <div className="font-semibold text-slate-900 text-sm capitalize">{trip.cargoType}</div>
              <div className="text-xs text-slate-400">{trip.id.toUpperCase()}</div>
            </div>
          </div>
          <StatusBadge status={trip.status} />
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
          <MapPin size={13} className="text-slate-400 flex-shrink-0" />
          <span>{trip.origin}</span>
          <ArrowRight size={12} className="text-slate-400" />
          <span>{trip.destination}</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
          <span>{trip.distanceKm} km</span>
          <span>{trip.weightTons} t</span>
          <span className="flex items-center gap-1"><Clock size={11} />{formatDate(trip.requiredDate)}</span>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-500">
            Ganancia estimada:{' '}
            <span className="font-bold text-campo-700">{formatARS((trip.estimatedCost || 0) * 0.72)}</span>
          </span>
          {showAccept && trip.status === 'pendiente' && (
            <button
              onClick={(e) => { e.stopPropagation(); acceptTrip(trip) }}
              className="btn-primary text-xs py-1.5 px-3"
            >
              Aceptar viaje
            </button>
          )}
        </div>
      </div>
    )
  }

  const lists = [available, accepted, history]
  const currentList = lists[tab]

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Buen día, Juan</h1>
          <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-0.5">
            <Star size={13} className="text-yellow-400 fill-yellow-400" />
            {me.rating} · {me.truck} · {me.plate}
          </div>
        </div>
        <button onClick={() => navigate('/transportista/perfil')} className="btn-secondary text-sm">
          Mi perfil
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <StatTile icon={DollarSign}  label="Ganancias estimadas"  value={formatARS(totalEarnings)}              delta="+15%" gradient="bg-gradient-to-br from-campo-600 to-campo-800"   iconBg="bg-white/20" />
        <StatTile icon={Truck}       label="Viajes aceptados"     value={accepted.length}                                   gradient="bg-gradient-to-br from-blue-500 to-blue-700"       iconBg="bg-white/20" />
        <StatTile icon={CheckCircle} label="Viajes completados"   value={me.tripsCompleted + history.length}   delta="+3"  gradient="bg-gradient-to-br from-teal-500 to-teal-700"       iconBg="bg-white/20" />
        <StatTile icon={Package}     label="Cargas disponibles"   value={available.length}                                  gradient="bg-gradient-to-br from-orange-400 to-orange-600"   iconBg="bg-white/20" />
        <StatTile icon={Fuel}        label="Litros estimados"     value={`${litrosGastados} L`}                            gradient="bg-gradient-to-br from-violet-500 to-violet-700"    iconBg="bg-white/20" />
        <StatTile icon={Flame}       label="Costo combustible"    value={formatARS(costoCombustible)}                      gradient="bg-gradient-to-br from-rose-500 to-rose-700"        iconBg="bg-white/20" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1 mb-6 w-fit">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              tab === i ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t}
            {i === 0 && available.length > 0 && (
              <span className="ml-1.5 bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{available.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {currentList.length === 0 ? (
        <EmptyState
          icon={Truck}
          title={tab === 0 ? 'No hay cargas disponibles' : tab === 1 ? 'No tenés viajes activos' : 'No hay historial aún'}
          description={tab === 0 ? 'En este momento no hay solicitudes de transporte en tu zona.' : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentList.map(trip => (
            <TripRow key={trip.id} trip={trip} showAccept={tab === 0} />
          ))}
        </div>
      )}
    </div>
  )
}
