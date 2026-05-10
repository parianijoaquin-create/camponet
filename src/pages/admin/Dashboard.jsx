import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import {
  Truck, Building2, DollarSign, Package, AlertTriangle,
  CheckCircle, RotateCcw, TrendingUp, Eye
} from 'lucide-react'
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
import { formatARS, formatRelative } from '../../lib/format'
import { PRODUCERS, TRANSPORTERS } from '../../data/seed'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts'

const MONTHLY_DATA = [
  { mes: 'Ene', viajes: 18 }, { mes: 'Feb', viajes: 24 }, { mes: 'Mar', viajes: 31 },
  { mes: 'Abr', viajes: 28 }, { mes: 'May', viajes: 42 }, { mes: 'Jun', viajes: 0 },
]

export default function AdminDashboard() {
  const { state, dispatch, toast } = useApp()
  const navigate = useNavigate()
  const [resetting, setResetting] = useState(false)

  const { trips } = state
  const pending  = trips.filter(t => t.status === 'pendiente')
  const done     = trips.filter(t => t.status === 'entregado')
  const totalRevenue = trips.reduce((s, t) => s + (t.estimatedCost || 0) * 0.08, 0)
  const activeTransporters = [...new Set(trips.filter(t => t.transporterId).map(t => t.transporterId))]

  const alerts = [
    ...pending.map(t => ({
      type: 'warning',
      message: `Viaje ${t.id.toUpperCase()} sin transportista (${t.origin} → ${t.destination})`,
      time: formatRelative(t.createdAt),
    })),
    ...(done.length > 0 ? [{ type: 'success', message: `${done.length} viajes entregados esta semana`, time: 'Hoy' }] : []),
  ]

  const resetDemo = () => {
    setResetting(true)
    setTimeout(() => {
      dispatch({ type: 'RESET_DEMO' })
      toast('Datos de demo reiniciados ✓')
      setResetting(false)
    }, 1000)
  }

  const advanceTrip = (trip) => {
    if (trip.status === 'entregado') return
    dispatch({ type: 'ADVANCE_STATUS', tripId: trip.id })
    toast(`Estado de ${trip.id.toUpperCase()} avanzado`)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Panel de administración</h1>
          <p className="text-slate-500 text-sm mt-0.5">CampoNet · Córdoba, Argentina</p>
        </div>
        <button
          onClick={resetDemo}
          disabled={resetting}
          className="btn-danger flex-shrink-0"
        >
          {resetting
            ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <RotateCcw size={15} />}
          Resetear demo
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 mb-8">
        <StatTile icon={Package}       label="Total viajes"           value={trips.length}               delta="+8" gradient="bg-gradient-to-br from-campo-600 to-campo-800"   iconBg="bg-white/20" />
        <StatTile icon={AlertTriangle} label="Sin asignar"            value={pending.length}                        gradient="bg-gradient-to-br from-orange-400 to-orange-600"  iconBg="bg-white/20" />
        <StatTile icon={Truck}         label="Transportistas activos" value={activeTransporters.length}             gradient="bg-gradient-to-br from-blue-500 to-blue-700"       iconBg="bg-white/20" />
        <StatTile icon={Building2}     label="Empresas"               value={PRODUCERS.length}                      gradient="bg-gradient-to-br from-violet-500 to-violet-700"   iconBg="bg-white/20" />
        <StatTile icon={CheckCircle}   label="Entregados"             value={done.length}               delta="+2" gradient="bg-gradient-to-br from-teal-500 to-teal-700"      iconBg="bg-white/20" />
        <StatTile icon={DollarSign}    label="Ingresos (8%)"          value={formatARS(totalRevenue)}               gradient="bg-gradient-to-br from-night-800 to-night-900"    iconBg="bg-white/15" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Chart */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-base font-semibold text-slate-900">Viajes por mes</div>
              <div className="text-xs text-slate-400">2026 — Córdoba</div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-campo-600 font-semibold">
              <TrendingUp size={14} /> +38% vs 2025
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12 }}
                cursor={{ fill: '#f0fdf4' }}
              />
              <Bar dataKey="viajes" radius={[4, 4, 0, 0]}>
                {MONTHLY_DATA.map((entry, i) => (
                  <Cell key={i} fill={i === 4 ? '#16a34a' : '#86efac'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Alerts */}
        <div className="card p-5">
          <div className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <AlertTriangle size={16} className="text-orange-500" /> Alertas operativas
          </div>
          {alerts.length === 0 ? (
            <div className="text-sm text-slate-400 text-center py-8">Sin alertas activas</div>
          ) : (
            <div className="space-y-3">
              {alerts.slice(0, 4).map((a, i) => (
                <div key={i} className={`flex gap-3 p-3 rounded-lg text-xs
                  ${a.type === 'warning' ? 'bg-orange-50 border border-orange-100' : 'bg-campo-50 border border-campo-100'}`}>
                  <span className={`flex-shrink-0 mt-0.5 ${a.type === 'warning' ? 'text-orange-500' : 'text-campo-600'}`}>
                    {a.type === 'warning' ? <AlertTriangle size={13} /> : <CheckCircle size={13} />}
                  </span>
                  <div>
                    <div className={`font-medium ${a.type === 'warning' ? 'text-orange-800' : 'text-campo-800'}`}>{a.message}</div>
                    <div className="text-slate-400 mt-0.5">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Trips table */}
      <div className="card overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="font-semibold text-slate-900">Gestión de viajes</div>
          <div className="text-xs text-slate-400">{trips.length} viajes en total</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Ruta</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Carga</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Estado</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Costo</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {trips.map(trip => (
                <tr key={trip.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3 text-xs text-slate-400 font-mono">{trip.id.toUpperCase()}</td>
                  <td className="px-4 py-3 text-slate-700 text-xs">{trip.origin} → {trip.destination}</td>
                  <td className="px-4 py-3 text-slate-500 capitalize text-xs hidden md:table-cell">{trip.cargoType}</td>
                  <td className="px-4 py-3"><StatusBadge status={trip.status} size="sm" /></td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-900 text-xs hidden sm:table-cell">{formatARS(trip.estimatedCost)}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => navigate(`/productor/viaje/${trip.id}`)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                        title="Ver seguimiento"
                      >
                        <Eye size={14} />
                      </button>
                      {trip.status !== 'entregado' && (
                        <button
                          onClick={() => advanceTrip(trip)}
                          className="text-xs px-2 py-1 rounded-lg bg-campo-50 text-campo-700 hover:bg-campo-100 font-medium"
                          title="Avanzar estado"
                        >
                          Avanzar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transporters table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 font-semibold text-slate-900">Transportistas registrados</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Nombre</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Camión</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Patente</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Calificación</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Docs</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Seguro</th>
              </tr>
            </thead>
            <tbody>
              {TRANSPORTERS.map(t => (
                <tr key={t.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-night-800 text-white text-xs font-bold flex items-center justify-center">{t.avatar}</div>
                      <div>
                        <div className="font-medium text-slate-900 text-sm">{t.name}</div>
                        <div className="text-xs text-slate-400">{t.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600 hidden md:table-cell">{t.truck}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-600 hidden sm:table-cell">{t.plate}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-bold text-yellow-600">⭐ {t.rating}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {t.docsVerified
                      ? <CheckCircle size={15} className="text-campo-600 mx-auto" />
                      : <AlertTriangle size={15} className="text-orange-500 mx-auto" />}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {t.insuranceValid
                      ? <CheckCircle size={15} className="text-campo-600 mx-auto" />
                      : <AlertTriangle size={15} className="text-orange-500 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
