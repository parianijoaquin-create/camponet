import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Wheat, Building2, Truck, Shield, ArrowRight, CheckCircle } from 'lucide-react'

const PROFILES = [
  {
    role: 'producer',
    userId: 'p1',
    icon: Building2,
    title: 'Productor / Empresa',
    description: 'Solicitá transporte para tus insumos agropecuarios y seguí cada viaje en tiempo real.',
    demo: 'Estancia La Esperanza · Río Cuarto',
    color: 'from-campo-600 to-campo-700',
    iconBg: 'bg-campo-50',
    iconColor: 'text-campo-600',
    accent: 'border-campo-200 hover:border-campo-400',
    features: ['Solicitar transporte', 'Seguimiento GPS', 'Gestión de costos'],
  },
  {
    role: 'transporter',
    userId: 't1',
    icon: Truck,
    title: 'Transportista Rural',
    description: 'Encontrá cargas disponibles cerca tuyo, aceptá viajes y gestioná tu historial.',
    demo: 'Juan Pérez · Scania R450 · ⭐ 4.9',
    color: 'from-night-800 to-night-900',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
    accent: 'border-slate-200 hover:border-slate-400',
    features: ['Cargas disponibles', 'Ganancias estimadas', 'Perfil verificado'],
  },
  {
    role: 'admin',
    userId: 'admin1',
    icon: Shield,
    title: 'Administrador',
    description: 'Supervisá toda la operación: viajes, transportistas, empresas y métricas globales.',
    demo: 'Panel CampoNet · Acceso total',
    color: 'from-orange-500 to-orange-600',
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-500',
    accent: 'border-orange-200 hover:border-orange-400',
    features: ['Métricas globales', 'Control de viajes', 'Gestión de alertas'],
  },
]

export default function Login() {
  const { dispatch } = useApp()
  const navigate = useNavigate()

  const enter = (profile) => {
    dispatch({ type: 'SET_ROLE', role: profile.role, userId: profile.userId })
    const paths = { producer: '/productor', transporter: '/transportista', admin: '/admin' }
    navigate(paths[profile.role])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-night-900 via-night-800 to-campo-900 flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 px-8 py-6">
        <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-campo-600 flex items-center justify-center">
          <img
            src="/LOGO.jpeg"
            alt="CampoNet"
            className="w-10 h-10 object-contain"
            onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block' }}
          />
          <Wheat size={22} className="text-white hidden" />
        </div>
        <div>
          <div className="text-white font-bold text-lg leading-tight">CampoNet</div>
          <div className="text-slate-400 text-xs">Plataforma de logística rural B2B</div>
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs text-slate-400 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
          <span className="w-2 h-2 bg-campo-400 rounded-full animate-pulse" />
          Demo interactivo
        </div>
      </header>

      {/* Hero */}
      <div className="text-center px-4 pt-8 pb-12">
        <div className="inline-flex items-center gap-2 bg-campo-600/20 border border-campo-500/30 rounded-full px-4 py-1.5 mb-6">
          <span className="text-campo-400 text-xs font-semibold">Prototipo funcional — Córdoba, Argentina</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          Logística rural<br /><span className="text-campo-400">conectada e inteligente</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Conectamos productores, transportistas y operadores en una sola plataforma digital.
        </p>
      </div>

      {/* Role cards */}
      <div className="flex-1 flex items-start justify-center px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl">
          {PROFILES.map(profile => (
            <button
              key={profile.role}
              onClick={() => enter(profile)}
              className={`card text-left p-6 border-2 transition-all duration-200 hover:shadow-xl hover:-translate-y-1 group ${profile.accent}`}
            >
              <div className={`w-12 h-12 rounded-xl ${profile.iconBg} flex items-center justify-center mb-4`}>
                <profile.icon size={24} className={profile.iconColor} />
              </div>
              <div className="font-bold text-slate-900 text-lg mb-1.5">{profile.title}</div>
              <div className="text-sm text-slate-500 mb-4 leading-relaxed">{profile.description}</div>

              <div className="space-y-1.5 mb-5">
                {profile.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-xs text-slate-600">
                    <CheckCircle size={13} className="text-campo-500 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-400">{profile.demo}</div>
                <ArrowRight size={16} className="text-slate-400 group-hover:text-campo-600 group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-8 text-slate-500 text-xs">
        © 2026 CampoNet — Plataforma B2B de logística rural · Córdoba, Argentina
      </div>
    </div>
  )
}
