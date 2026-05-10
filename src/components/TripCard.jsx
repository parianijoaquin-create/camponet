import { useNavigate } from 'react-router-dom'
import { MapPin, Calendar, Weight, ArrowRight } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { formatDate, formatARS } from '../lib/format'
import { TRANSPORTERS } from '../data/seed'

const CARGO_ICONS = { granos: '🌾', semillas: '🌱', fertilizantes: '🧪', agroquimicos: '⚗️', otros: '📦' }

export default function TripCard({ trip }) {
  const navigate = useNavigate()
  const transporter = TRANSPORTERS.find(t => t.id === trip.transporterId)

  return (
    <div
      className="card p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(`/productor/viaje/${trip.id}`)}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
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
        <MapPin size={14} className="text-slate-400 flex-shrink-0" />
        <span className="truncate">{trip.origin}</span>
        <ArrowRight size={13} className="text-slate-400 flex-shrink-0" />
        <span className="truncate">{trip.destination}</span>
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
        <span className="flex items-center gap-1"><Calendar size={12} />{formatDate(trip.requiredDate)}</span>
        <span className="flex items-center gap-1"><Weight size={12} />{trip.weightTons} t</span>
        <span>{trip.distanceKm} km</span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        {transporter ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-campo-600 text-white text-xs font-bold flex items-center justify-center">
              {transporter.avatar}
            </div>
            <span className="text-xs text-slate-600 font-medium">{transporter.name}</span>
          </div>
        ) : (
          <span className="text-xs text-orange-600 font-medium">Sin transportista</span>
        )}
        <span className="text-sm font-bold text-slate-900">{formatARS(trip.estimatedCost)}</span>
      </div>
    </div>
  )
}
