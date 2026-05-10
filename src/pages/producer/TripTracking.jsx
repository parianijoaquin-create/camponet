import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { ArrowLeft, Phone, Mail, Star, Truck, FileCheck, Clock, PlayCircle } from 'lucide-react'
import StatusBadge from '../../components/StatusBadge'
import RealMap from '../../components/RealMap'
import { formatDate, formatARS, etaText } from '../../lib/format'
import { STATUS_ORDER, STATUS_META, nextStatusLabel, tripProgress } from '../../lib/status'
import { TRANSPORTERS } from '../../data/seed'
import EmptyState from '../../components/EmptyState'

const DOC_STATUS = {
  verificado: 'bg-campo-100 text-campo-700',
  pendiente:  'bg-yellow-100 text-yellow-700',
}

export default function TripTracking() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, dispatch, toast } = useApp()

  const trip = state.trips.find(t => t.id === id)
  if (!trip) return (
    <div className="p-6">
      <EmptyState icon={Truck} title="Viaje no encontrado" action={<button onClick={() => navigate(-1)} className="btn-secondary">Volver</button>} />
    </div>
  )

  const transporter = TRANSPORTERS.find(t => t.id === trip.transporterId)
  const progress = tripProgress(trip.status)
  const nextLabel = nextStatusLabel(trip.status)

  const advance = () => {
    dispatch({ type: 'ADVANCE_STATUS', tripId: trip.id })
    const next = STATUS_ORDER[STATUS_ORDER.indexOf(trip.status) + 1]
    toast(next === 'en_camino' ? 'El transportista está en camino 🚛' : next === 'entregado' ? '¡Carga entregada exitosamente! ✓' : 'Estado actualizado')
  }

  const timelineItems = STATUS_ORDER.map((s, i) => {
    const current = STATUS_ORDER.indexOf(trip.status)
    return { status: s, label: STATUS_META[s].label, done: i <= current, active: i === current }
  })

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900">Seguimiento de viaje</h1>
            <span className="text-xs text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded">{trip.id.toUpperCase()}</span>
          </div>
          <p className="text-sm text-slate-500">{trip.origin} → {trip.destination}</p>
        </div>
        <StatusBadge status={trip.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: map + timeline */}
        <div className="lg:col-span-2 space-y-5">
          {/* Map */}
          <div className="card overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">Mapa de seguimiento</span>
              {trip.etaMinutes > 0 && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
                  <Clock size={12} /> ETA: {etaText(trip.etaMinutes)}
                </span>
              )}
              {trip.status === 'entregado' && (
                <span className="text-xs font-medium text-campo-600 bg-campo-50 px-2.5 py-1 rounded-full">✓ Entregado</span>
              )}
            </div>
            <div className="p-3">
              <RealMap origin={trip.origin} destination={trip.destination} status={trip.status} />
            </div>
          </div>

          {/* Progress bar */}
          <div className="card p-5">
            <div className="text-sm font-semibold text-slate-700 mb-4">Estado del viaje</div>
            <div className="relative">
              <div className="flex justify-between mb-2">
                {timelineItems.map((item, i) => (
                  <div key={item.status} className="flex flex-col items-center flex-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                      ${item.done ? 'bg-campo-600 border-campo-600 text-white' : 'bg-white border-slate-300 text-slate-400'}`}>
                      {item.done ? '✓' : i + 1}
                    </div>
                    <div className={`text-xs mt-1.5 font-medium text-center ${item.active ? 'text-campo-700' : item.done ? 'text-slate-600' : 'text-slate-400'}`}>
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute top-3.5 left-0 right-0 h-0.5 bg-slate-200 -z-10 mx-4" />
              <div
                className="absolute top-3.5 left-0 h-0.5 bg-campo-600 -z-10 ml-4 transition-all duration-700"
                style={{ width: `calc(${progress}% - 2rem)` }}
              />
            </div>

            {nextLabel && trip.status !== 'entregado' && (
              <div className="mt-5 pt-4 border-t border-slate-100">
                <button onClick={advance} className="btn-orange w-full justify-center">
                  <PlayCircle size={16} />
                  Simular avance: {nextLabel}
                </button>
              </div>
            )}
          </div>

          {/* Documents */}
          {trip.documents.length > 0 && (
            <div className="card p-5">
              <div className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <FileCheck size={16} className="text-campo-600" /> Documentación
              </div>
              <div className="space-y-2">
                {trip.documents.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <span className="text-sm text-slate-700">{doc.name}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${DOC_STATUS[doc.status]}`}>
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column: info */}
        <div className="space-y-5">
          {/* Trip details */}
          <div className="card p-5">
            <div className="text-sm font-semibold text-slate-700 mb-3">Detalles del viaje</div>
            <div className="space-y-3">
              {[
                { label: 'Tipo de carga', value: trip.cargoType, capitalize: true },
                { label: 'Origen', value: trip.origin },
                { label: 'Destino', value: trip.destination },
                { label: 'Distancia', value: `${trip.distanceKm} km` },
                { label: 'Peso', value: `${trip.weightTons} t` },
                { label: 'Volumen', value: trip.volume || '—' },
                { label: 'Fecha requerida', value: formatDate(trip.requiredDate) },
                { label: 'Costo estimado', value: formatARS(trip.estimatedCost), bold: true },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">{item.label}</span>
                  <span className={`${item.bold ? 'font-bold text-slate-900' : 'text-slate-700'} ${item.capitalize ? 'capitalize' : ''}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
            {trip.notes && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <div className="text-xs text-slate-400 mb-1">Observaciones</div>
                <div className="text-xs text-slate-600">{trip.notes}</div>
              </div>
            )}
          </div>

          {/* Transporter */}
          {transporter ? (
            <div className="card p-5">
              <div className="text-sm font-semibold text-slate-700 mb-3">Transportista asignado</div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-night-800 text-white font-bold flex items-center justify-center">
                  {transporter.avatar}
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{transporter.name}</div>
                  <div className="flex items-center gap-1 text-xs text-yellow-500">
                    {[1,2,3,4,5].map(i => <Star key={i} size={11} className={i <= Math.round(transporter.rating) ? 'fill-yellow-400' : 'fill-slate-200'} />)}
                    <span className="text-slate-500 ml-0.5">{transporter.rating}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Truck size={14} className="text-slate-400" />
                  {transporter.truck} · {transporter.plate}
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone size={14} className="text-slate-400" />
                  {transporter.phone}
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail size={14} className="text-slate-400" />
                  {transporter.email}
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-5 border-dashed">
              <div className="text-sm font-semibold text-slate-700 mb-1">Sin transportista</div>
              <p className="text-xs text-slate-400 mb-3">Todavía no se asignó un transportista a este viaje.</p>
              <button onClick={() => navigate(`/productor/buscar/${trip.id}`)} className="btn-orange w-full justify-center text-sm">
                Buscar transportista
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
