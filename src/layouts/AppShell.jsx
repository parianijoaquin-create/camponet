import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import {
  LayoutDashboard, Truck, Package, User, Settings,
  LogOut, Menu, Bell, Wheat,
  Building2, Shield, ChevronDown, Check, ArrowLeft, Newspaper
} from 'lucide-react'

const ROLES = [
  { role: 'producer',    userId: 'p1',     label: 'Productor / Empresa',  sublabel: 'Estancia La Esperanza', icon: Building2, avatar: 'MI', path: '/productor' },
  { role: 'transporter', userId: 't1',     label: 'Transportista Rural',  sublabel: 'Juan Pérez · Scania R450', icon: Truck,     avatar: 'JP', path: '/transportista' },
  { role: 'admin',       userId: 'admin1', label: 'Administrador',        sublabel: 'CampoNet · Acceso total',  icon: Shield,    avatar: 'AD', path: '/admin' },
]

function RoleSwitcher() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const current = ROLES.find(r => r.role === state.role) || ROLES[0]

  const switchTo = (r) => {
    dispatch({ type: 'SET_ROLE', role: r.role, userId: r.userId })
    navigate(r.path)
    setOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-medium text-slate-700 transition-colors"
      >
        <span className="w-6 h-6 rounded-full bg-campo-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
          {current.avatar}
        </span>
        <span className="hidden sm:inline">{current.label}</span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
          <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">Cambiar perfil</div>
          {ROLES.map(r => {
            const isActive = r.role === state.role
            return (
              <button
                key={r.role}
                onClick={() => switchTo(r)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 transition-colors text-left
                  ${isActive ? 'bg-campo-50' : ''}`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
                  ${isActive ? 'bg-campo-600' : 'bg-slate-100'}`}>
                  <r.icon size={17} className={isActive ? 'text-white' : 'text-slate-500'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold ${isActive ? 'text-campo-700' : 'text-slate-800'}`}>{r.label}</div>
                  <div className="text-xs text-slate-400 truncate">{r.sublabel}</div>
                </div>
                {isActive && <Check size={15} className="text-campo-600 flex-shrink-0" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Logo({ className = '' }) {
  return (
    <img
      src="/LOGO.jpeg"
      alt="CampoNet"
      className={`object-contain ${className}`}
      onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
    />
  )
}

const NAV = {
  producer: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/productor' },
    { label: 'Noticias', icon: Newspaper, path: '/productor/noticias' },
    { label: 'Solicitar transporte', icon: Package, path: '/productor/solicitar' },
  ],
  transporter: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/transportista' },
    { label: 'Noticias', icon: Newspaper, path: '/transportista/noticias' },
    { label: 'Mi perfil', icon: User, path: '/transportista/perfil' },
  ],
  admin: [
    { label: 'Panel admin', icon: Settings, path: '/admin' },
    { label: 'Noticias', icon: Newspaper, path: '/admin/noticias' },
  ],
}

const ROLE_LABELS = { producer: 'Productor', transporter: 'Transportista', admin: 'Administrador' }

function Sidebar({ state, dispatch, navigate, location, nav, setOpen }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-night-800">
        <div className="relative w-8 h-8 flex-shrink-0">
          <Logo className="w-8 h-8 rounded-lg" />
          <div className="w-8 h-8 bg-campo-600 rounded-lg items-center justify-center hidden">
            <Wheat size={18} className="text-white" />
          </div>
        </div>
        <div>
          <div className="text-white font-bold text-base leading-tight">CampoNet</div>
          <div className="text-slate-400 text-xs">Logística Rural</div>
        </div>
      </div>

      <div className="px-3 py-4 border-b border-night-800">
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-full bg-campo-600 flex items-center justify-center text-white text-xs font-bold">
            {state.userId
              ? (state.role === 'admin' ? 'AD' :
                 state.role === 'producer' ? 'MI' : 'JP')
              : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-medium truncate">
              {state.role === 'admin' ? 'Administrador' :
               state.role === 'producer' ? 'Estancia La Esperanza' :
               'Juan Pérez'}
            </div>
            <div className="text-slate-400 text-xs">{ROLE_LABELS[state.role]}</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map(item => {
          const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
          return (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setOpen(false) }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left
                ${active ? 'bg-campo-600 text-white' : 'text-slate-300 hover:bg-night-800 hover:text-white'}`}
            >
              <item.icon size={17} />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-night-800 space-y-1">
        <button
          onClick={() => { dispatch({ type: 'LOGOUT' }); navigate('/') }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-night-800 hover:text-white transition-colors text-left"
        >
          <LogOut size={17} />
          Cambiar perfil
        </button>
      </div>
    </div>
  )
}

export default function AppShell({ children }) {
  const { state, dispatch } = useApp()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const nav = NAV[state.role] || []
  const sidebarProps = { state, dispatch, navigate, location, nav, setOpen }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 flex-col bg-night-900 flex-shrink-0">
        <Sidebar {...sidebarProps} />
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-56 bg-night-900 z-50">
            <Sidebar {...sidebarProps} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 h-14 flex items-center px-4 gap-2 flex-shrink-0">
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <Menu size={20} />
          </button>
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            title="Volver"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <div className="relative">
              <button className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 relative">
                <Bell size={19} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
              </button>
            </div>
            <RoleSwitcher />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
