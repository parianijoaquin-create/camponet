import { Star, Truck, MapPin, Shield, CheckCircle } from 'lucide-react'
import { formatARS } from '../lib/format'

export default function TransporterCard({ transporter, distanceKm, weightTons, onAssign, assigned }) {
  const estimatedCost = formatARS(Math.round(distanceKm * weightTons * transporter.pricePerKm / 30))
  const stars = Math.round(transporter.rating)

  return (
    <div className="card p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-11 h-11 rounded-full bg-night-800 text-white font-bold flex items-center justify-center text-sm flex-shrink-0">
          {transporter.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-slate-900">{transporter.name}</div>
          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            <MapPin size={11} /> {transporter.location}
          </div>
          <div className="flex items-center gap-1 mt-1">
            {[1,2,3,4,5].map(i => (
              <Star key={i} size={11} className={i <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 fill-slate-200'} />
            ))}
            <span className="text-xs text-slate-500 ml-0.5">{transporter.rating}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-slate-900">{estimatedCost}</div>
          <div className="text-xs text-slate-400">estimado</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-slate-50 rounded-lg p-2.5">
          <div className="text-xs text-slate-500 mb-0.5">Camión</div>
          <div className="text-xs font-semibold text-slate-800 flex items-center gap-1">
            <Truck size={12} className="text-campo-600" />{transporter.truck}
          </div>
        </div>
        <div className="bg-slate-50 rounded-lg p-2.5">
          <div className="text-xs text-slate-500 mb-0.5">Capacidad</div>
          <div className="text-xs font-semibold text-slate-800">{transporter.capacityTons} toneladas</div>
        </div>
        <div className="bg-slate-50 rounded-lg p-2.5">
          <div className="text-xs text-slate-500 mb-0.5">Viajes</div>
          <div className="text-xs font-semibold text-slate-800">{transporter.tripsCompleted} realizados</div>
        </div>
        <div className="bg-slate-50 rounded-lg p-2.5">
          <div className="text-xs text-slate-500 mb-0.5">Precio/km</div>
          <div className="text-xs font-semibold text-slate-800">{formatARS(transporter.pricePerKm)}/km</div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        {transporter.docsVerified && (
          <span className="flex items-center gap-1 text-xs text-campo-700 bg-campo-50 px-2 py-1 rounded-full">
            <CheckCircle size={11} /> Docs verificados
          </span>
        )}
        {transporter.insuranceValid && (
          <span className="flex items-center gap-1 text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded-full">
            <Shield size={11} /> Seguro vigente
          </span>
        )}
      </div>

      {assigned ? (
        <div className="w-full text-center py-2.5 rounded-lg bg-campo-50 text-campo-700 text-sm font-semibold">
          ✓ Asignado
        </div>
      ) : (
        <button onClick={onAssign} className="btn-primary w-full justify-center">
          Asignar viaje
        </button>
      )}
    </div>
  )
}
