import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Truck, Phone, Mail, MapPin, Star, Shield, CheckCircle, XCircle, Award } from 'lucide-react'
import { TRANSPORTERS } from '../../data/seed'
import { useApp } from '../../context/AppContext'
import { formatARS } from '../../lib/format'

export default function TransporterProfile() {
  const navigate = useNavigate()
  const { state } = useApp()
  const me = TRANSPORTERS[0]

  const myTrips = state.trips.filter(t => t.transporterId === me.id)
  const totalEarnings = myTrips.filter(t => t.status === 'entregado').reduce((s, t) => s + (t.estimatedCost || 0) * 0.72, 0)

  const stars = Math.round(me.rating)

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Mi perfil</h1>
          <p className="text-sm text-slate-500">Datos del transportista registrado</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Profile card */}
        <div className="card p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-night-800 text-white font-bold flex items-center justify-center text-lg sm:text-xl flex-shrink-0">
              {me.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 break-words leading-tight">{me.name}</h2>
              <div className="flex items-center flex-wrap gap-1 mt-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={15} className={i <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 fill-slate-200'} />
                ))}
                <span className="text-sm font-bold text-slate-700 ml-1">{me.rating}</span>
                <span className="text-xs text-slate-400 ml-1">({me.tripsCompleted} viajes)</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1.5">
                <MapPin size={13} className="text-slate-400 flex-shrink-0" />
                <span className="truncate">{me.location}</span>
              </div>
            </div>
            {/* Desktop: ganancias a la derecha */}
            <div className="hidden sm:block text-right flex-shrink-0">
              <div className="text-xs text-slate-400">Ganancias estimadas</div>
              <div className="text-lg font-bold text-campo-700">{formatARS(totalEarnings)}</div>
            </div>
          </div>

          {/* Mobile: ganancias como fila inferior */}
          <div className="sm:hidden mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Ganancias estimadas</span>
            <span className="text-lg font-bold text-campo-700">{formatARS(totalEarnings)}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-4 sm:mt-5">
            <div className="flex items-center gap-2 text-sm text-slate-600 min-w-0">
              <Phone size={15} className="text-slate-400 flex-shrink-0" />
              <span className="truncate">{me.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 min-w-0">
              <Mail size={15} className="text-slate-400 flex-shrink-0" />
              <span className="truncate">{me.email}</span>
            </div>
          </div>
        </div>

        {/* Vehicle */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Truck size={17} className="text-campo-600" />
            <span className="font-semibold text-slate-800">Datos del vehículo</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: 'Modelo', value: me.truck },
              { label: 'Patente', value: me.plate },
              { label: 'Capacidad', value: `${me.capacityTons} toneladas` },
              { label: 'Precio/km', value: formatARS(me.pricePerKm) },
              { label: 'Experiencia', value: `${me.yearsExp} años` },
            ].map(item => (
              <div key={item.label} className="bg-slate-50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-0.5">{item.label}</div>
                <div className="text-sm font-semibold text-slate-800">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={17} className="text-campo-600" />
            <span className="font-semibold text-slate-800">Certificaciones y habilitaciones</span>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Documentación verificada', ok: me.docsVerified },
              { label: 'Seguro de transporte vigente', ok: me.insuranceValid },
              { label: 'RUTA habilitado (ANSES)', ok: true },
              { label: 'Libreta sanitaria actualizada', ok: true },
              { label: 'Curso de cargas peligrosas', ok: me.specialties.includes('agroquimicos') },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <span className="text-sm text-slate-700">{item.label}</span>
                {item.ok ? (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-campo-700 bg-campo-50 px-2.5 py-1 rounded-full">
                    <CheckCircle size={12} /> Verificado
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                    <XCircle size={12} /> Pendiente
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Award size={17} className="text-campo-600" />
            <span className="font-semibold text-slate-800">Estadísticas</span>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
            <div className="bg-campo-50 rounded-xl p-3 sm:p-4">
              <div className="text-xl sm:text-2xl font-bold text-campo-700">{me.tripsCompleted}</div>
              <div className="text-[11px] sm:text-xs text-slate-500 mt-1">Viajes realizados</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 sm:p-4">
              <div className="text-xl sm:text-2xl font-bold text-blue-700">{me.rating}</div>
              <div className="text-[11px] sm:text-xs text-slate-500 mt-1">Calificación</div>
            </div>
            <div className="bg-orange-50 rounded-xl p-3 sm:p-4">
              <div className="text-xl sm:text-2xl font-bold text-orange-600">{me.yearsExp}</div>
              <div className="text-[11px] sm:text-xs text-slate-500 mt-1">Años de exp.</div>
            </div>
          </div>
        </div>

        {/* Specialties */}
        <div className="card p-5">
          <div className="font-semibold text-slate-800 mb-3">Especialidades de carga</div>
          <div className="flex flex-wrap gap-2">
            {me.specialties.map(s => (
              <span key={s} className="bg-campo-100 text-campo-700 text-sm font-medium px-3 py-1.5 rounded-full capitalize">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
