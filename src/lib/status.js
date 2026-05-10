export const STATUS_ORDER = ['pendiente', 'asignado', 'en_camino', 'entregado']

export const STATUS_META = {
  pendiente:  { label: 'Pendiente',   color: 'bg-slate-100 text-slate-600',   dot: 'bg-slate-400'  },
  asignado:   { label: 'Asignado',    color: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-500'   },
  en_camino:  { label: 'En camino',   color: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
  entregado:  { label: 'Entregado',   color: 'bg-campo-100 text-campo-700',   dot: 'bg-campo-500'  },
}

export function nextStatus(current) {
  const idx = STATUS_ORDER.indexOf(current)
  if (idx === -1 || idx === STATUS_ORDER.length - 1) return null
  return STATUS_ORDER[idx + 1]
}

export function nextStatusLabel(current) {
  const next = nextStatus(current)
  if (!next) return null
  return STATUS_META[next].label
}

export function tripProgress(status) {
  const idx = STATUS_ORDER.indexOf(status)
  return Math.round(((idx + 1) / STATUS_ORDER.length) * 100)
}
