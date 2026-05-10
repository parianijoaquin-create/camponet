export function formatARS(amount) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(amount)
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr + (dateStr.includes('T') ? '' : 'T00:00:00')).toLocaleDateString('es-AR', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

export function formatRelative(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now - d
  const diffH = Math.floor(diffMs / 3600000)
  if (diffH < 1) return 'Hace unos minutos'
  if (diffH < 24) return `Hace ${diffH}h`
  const diffD = Math.floor(diffH / 24)
  return `Hace ${diffD} día${diffD > 1 ? 's' : ''}`
}

export function calcCost(distanceKm, weightTons, pricePerKm) {
  return Math.round(distanceKm * weightTons * pricePerKm / 30)
}

export function etaText(minutes) {
  if (!minutes && minutes !== 0) return '—'
  if (minutes === 0) return 'Entregado'
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}
