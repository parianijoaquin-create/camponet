import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { ArrowLeft, MapPin, Package, Calendar, FileText, Search } from 'lucide-react'
import { CITIES_CORDOBA, CARGO_TYPES, ROUTES } from '../../data/seed'

const CARGO_LABELS = { granos: 'Granos', semillas: 'Semillas', fertilizantes: 'Fertilizantes', agroquimicos: 'Agroquímicos', otros: 'Otros' }

function getDistance(origin, destination) {
  const key = `${origin} → ${destination}`
  const rev = `${destination} → ${origin}`
  return ROUTES[key]?.distanceKm || ROUTES[rev]?.distanceKm || Math.round(80 + Math.random() * 180)
}

export default function RequestTransport() {
  const { dispatch, toast } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    cargoType: '', origin: '', destination: '', requiredDate: '', weightTons: '', volume: '', notes: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.cargoType) e.cargoType = 'Requerido'
    if (!form.origin) e.origin = 'Requerido'
    if (!form.destination) e.destination = 'Requerido'
    if (form.origin && form.destination && form.origin === form.destination) e.destination = 'Destino debe ser diferente al origen'
    if (!form.requiredDate) e.requiredDate = 'Requerido'
    if (!form.weightTons || isNaN(form.weightTons) || +form.weightTons <= 0) e.weightTons = 'Ingresá un peso válido'
    return e
  }

  const submit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setTimeout(() => {
      const distanceKm = getDistance(form.origin, form.destination)
      const trip = {
        producerId: 'p1',
        cargoType: form.cargoType,
        origin: form.origin,
        destination: form.destination,
        distanceKm,
        requiredDate: form.requiredDate,
        weightTons: parseFloat(form.weightTons),
        volume: form.volume || `${Math.round(+form.weightTons * 3)} m³`,
        notes: form.notes,
        estimatedCost: Math.round(distanceKm * +form.weightTons * 360),
      }
      dispatch({ type: 'CREATE_TRIP', trip })
      toast('Solicitud creada. Buscando transportistas disponibles...')
      // Navigate to search with temp id (will be set in context)
      navigate('/productor/buscar/new')
      setLoading(false)
    }, 1200)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Solicitar transporte</h1>
          <p className="text-sm text-slate-500">Completá los datos de tu carga</p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-5">
        {/* Cargo type */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Package size={17} className="text-campo-600" />
            <span className="font-semibold text-slate-800">Tipo de carga</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CARGO_TYPES.map(type => (
              <button
                key={type}
                type="button"
                onClick={() => set('cargoType', type)}
                className={`px-3 py-2.5 rounded-lg border-2 text-sm font-medium transition-all capitalize
                  ${form.cargoType === type
                    ? 'border-campo-500 bg-campo-50 text-campo-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
              >
                {CARGO_LABELS[type]}
              </button>
            ))}
          </div>
          {errors.cargoType && <p className="text-xs text-red-500 mt-2">{errors.cargoType}</p>}
        </div>

        {/* Route */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={17} className="text-campo-600" />
            <span className="font-semibold text-slate-800">Ruta</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Origen</label>
              <select className="select" value={form.origin} onChange={e => set('origin', e.target.value)}>
                <option value="">Seleccioná ciudad</option>
                {CITIES_CORDOBA.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.origin && <p className="text-xs text-red-500 mt-1">{errors.origin}</p>}
            </div>
            <div>
              <label className="label">Destino</label>
              <select className="select" value={form.destination} onChange={e => set('destination', e.target.value)}>
                <option value="">Seleccioná ciudad</option>
                {CITIES_CORDOBA.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.destination && <p className="text-xs text-red-500 mt-1">{errors.destination}</p>}
            </div>
          </div>
          {form.origin && form.destination && form.origin !== form.destination && (
            <div className="mt-3 flex items-center gap-2 text-xs text-campo-700 bg-campo-50 rounded-lg px-3 py-2">
              <MapPin size={12} />
              Distancia estimada: <strong>{getDistance(form.origin, form.destination)} km</strong>
            </div>
          )}
        </div>

        {/* Date & weight */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={17} className="text-campo-600" />
            <span className="font-semibold text-slate-800">Detalles de carga</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Fecha requerida</label>
              <input
                type="date"
                className="input"
                value={form.requiredDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => set('requiredDate', e.target.value)}
              />
              {errors.requiredDate && <p className="text-xs text-red-500 mt-1">{errors.requiredDate}</p>}
            </div>
            <div>
              <label className="label">Peso (toneladas)</label>
              <input
                type="number"
                className="input"
                placeholder="Ej: 28"
                value={form.weightTons}
                min="1" max="35" step="0.5"
                onChange={e => set('weightTons', e.target.value)}
              />
              {errors.weightTons && <p className="text-xs text-red-500 mt-1">{errors.weightTons}</p>}
            </div>
            <div>
              <label className="label">Volumen (opcional)</label>
              <input
                type="text"
                className="input"
                placeholder="Ej: 90 m³"
                value={form.volume}
                onChange={e => set('volume', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={17} className="text-campo-600" />
            <span className="font-semibold text-slate-800">Observaciones</span>
          </div>
          <textarea
            className="textarea"
            rows={3}
            placeholder="Indicaciones especiales, condiciones de carga, restricciones..."
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
          />
        </div>

        {/* Cost preview */}
        {form.origin && form.destination && form.weightTons && form.origin !== form.destination && (
          <div className="card p-4 bg-campo-50 border-campo-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-campo-700 font-medium">Costo estimado</span>
              <span className="text-xl font-bold text-campo-800">
                {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })
                  .format(getDistance(form.origin, form.destination) * +form.weightTons * 360)}
              </span>
            </div>
            <p className="text-xs text-campo-600 mt-1">El precio final varía según el transportista asignado</p>
          </div>
        )}

        <button type="submit" className="btn-primary w-full justify-center py-3" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Buscando transportistas...</span>
          ) : (
            <><Search size={16} /> Buscar transportista</>
          )}
        </button>
      </form>
    </div>
  )
}
