import { Newspaper, RefreshCw, TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react'
import { formatARS, formatDate } from '../../lib/format'
import { useMarketData } from '../../hooks/useMarketData'

function VariationBadge({ value }) {
  const positive = value >= 0
  const Icon = positive ? TrendingUp : TrendingDown
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
      positive ? 'bg-campo-50 text-campo-700' : 'bg-red-50 text-red-600'
    }`}>
      <Icon size={11} />
      {positive ? '+' : ''}{value.toFixed(1)}%
    </span>
  )
}

function CommoditySkeleton() {
  return (
    <div className="card p-4 animate-pulse">
      <div className="h-4 w-20 bg-slate-100 rounded mb-3" />
      <div className="h-6 w-28 bg-slate-100 rounded mb-2" />
      <div className="h-4 w-24 bg-slate-100 rounded" />
    </div>
  )
}

export default function News() {
  const { dolar, board, loading, error, refresh } = useMarketData()

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-3 mb-5 flex-col sm:flex-row">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-campo-600 text-white flex items-center justify-center flex-shrink-0">
            <Newspaper size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Noticias del mercado</h1>
            <p className="text-sm text-slate-500">Pizarra de Rosario y cotización del dólar BNA</p>
          </div>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="btn-secondary text-sm self-end sm:self-auto"
          aria-label="Actualizar cotizaciones"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Actualizar
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-lg px-3 py-2">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Dólar BNA */}
      <div className="card p-5 mb-5 bg-gradient-to-br from-night-900 to-night-800 text-white border-0">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign size={18} className="text-campo-400" />
          <span className="text-sm font-semibold tracking-wide">Dólar BNA — Banco Nación</span>
        </div>
        {loading && !dolar ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 bg-white/10 rounded-lg animate-pulse" />
            <div className="h-16 bg-white/10 rounded-lg animate-pulse" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-xs text-slate-300 mb-1">Compra</div>
              <div className="text-2xl sm:text-3xl font-bold">{formatARS(dolar.compra)}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-xs text-slate-300 mb-1">Venta</div>
              <div className="text-2xl sm:text-3xl font-bold text-campo-400">{formatARS(dolar.venta)}</div>
            </div>
          </div>
        )}
        {dolar?.fechaActualizacion && (
          <div className="text-xs text-slate-400 mt-3">
            Actualizado: {new Date(dolar.fechaActualizacion).toLocaleString('es-AR')}
          </div>
        )}
      </div>

      {/* Pizarra Rosario */}
      <div className="flex items-end justify-between mb-3 gap-2 flex-wrap">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Pizarra de Rosario</h2>
          <p className="text-xs text-slate-500">
            Fecha: {board ? formatDate(board.fechaPizarra) : '—'} · Fuente: BCR
          </p>
        </div>
        <span className="text-[11px] text-slate-400">Valores referenciales · USD/tn</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {loading && !board
          ? [...Array(5)].map((_, i) => <CommoditySkeleton key={i} />)
          : board.commodities.map(c => (
              <div key={c.id} className="card p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl" aria-hidden="true">{c.emoji}</span>
                    <span className="font-semibold text-slate-800">{c.nombre}</span>
                  </div>
                  <VariationBadge value={c.variacion} />
                </div>
                <div className="mt-3 space-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-400">USD / tn</span>
                    <span className="text-lg font-bold text-slate-900">
                      US$ {c.usdPorTonelada.toLocaleString('es-AR')}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-400">ARS / tn</span>
                    <span className="text-base font-semibold text-campo-700">
                      {formatARS(c.arsPorTonelada)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
      </div>

      <p className="text-[11px] text-slate-400 mt-5 text-center">
        Los precios en ARS se calculan a la cotización venta del dólar BNA del día.
        Valores informativos · No constituyen oferta comercial.
      </p>
    </div>
  )
}
