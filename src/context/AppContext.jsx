import { createContext, useContext, useReducer, useEffect } from 'react'
import { PRODUCERS, TRANSPORTERS, SEED_TRIPS } from '../data/seed'
import { STATUS_ORDER } from '../lib/status'

const AppContext = createContext(null)

const INITIAL_STATE = {
  role: null,      // 'producer' | 'transporter' | 'admin'
  userId: null,    // producer id or transporter id
  trips: SEED_TRIPS,
  toasts: [],
}

function loadState() {
  try {
    const raw = localStorage.getItem('camponet_state')
    if (!raw) return INITIAL_STATE
    const saved = JSON.parse(raw)
    return { ...INITIAL_STATE, trips: saved.trips || SEED_TRIPS }
  } catch { return INITIAL_STATE }
}

function saveState(state) {
  try { localStorage.setItem('camponet_state', JSON.stringify({ trips: state.trips })) } catch { /* ignore */ }
}

let toastId = 0

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.role, userId: action.userId }

    case 'LOGOUT':
      return { ...state, role: null, userId: null }

    case 'CREATE_TRIP': {
      const trip = {
        ...action.trip,
        id: 'vj' + Date.now().toString().slice(-6),
        status: 'pendiente',
        transporterId: null,
        createdAt: new Date().toISOString(),
        etaMinutes: null,
        documents: [],
      }
      return { ...state, trips: [trip, ...state.trips] }
    }

    case 'ASSIGN_TRANSPORTER': {
      const { tripId, transporterId, estimatedCost } = action
      return {
        ...state,
        trips: state.trips.map(t =>
          t.id === tripId
            ? { ...t, transporterId, status: 'asignado', estimatedCost, etaMinutes: Math.round(t.distanceKm * 0.5) }
            : t
        ),
      }
    }

    case 'ADVANCE_STATUS': {
      const trip = state.trips.find(t => t.id === action.tripId)
      if (!trip) return state
      const idx = STATUS_ORDER.indexOf(trip.status)
      if (idx >= STATUS_ORDER.length - 1) return state
      const next = STATUS_ORDER[idx + 1]
      const etaMinutes = next === 'en_camino' ? Math.round(trip.distanceKm * 0.45)
        : next === 'entregado' ? 0
        : trip.etaMinutes
      return {
        ...state,
        trips: state.trips.map(t =>
          t.id === action.tripId ? { ...t, status: next, etaMinutes } : t
        ),
      }
    }

    case 'TRANSPORTER_ACCEPT': {
      return {
        ...state,
        trips: state.trips.map(t =>
          t.id === action.tripId && t.status === 'pendiente'
            ? { ...t, transporterId: action.transporterId, status: 'asignado', etaMinutes: Math.round(t.distanceKm * 0.5) }
            : t
        ),
      }
    }

    case 'ADD_TOAST': {
      const toast = { id: ++toastId, ...action.toast }
      return { ...state, toasts: [...state.toasts, toast] }
    }

    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.id) }

    case 'RESET_DEMO':
      localStorage.removeItem('camponet_state')
      return { ...INITIAL_STATE, trips: SEED_TRIPS }

    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, loadState)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { saveState(state) }, [state.trips])

  const toast = (message, type = 'success') => {
    dispatch({ type: 'ADD_TOAST', toast: { message, kind: type } })
  }

  return (
    <AppContext.Provider value={{ state, dispatch, toast, producers: PRODUCERS, transporters: TRANSPORTERS }}>
      {children}
    </AppContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  return useContext(AppContext)
}
