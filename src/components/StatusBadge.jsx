import { STATUS_META } from '../lib/status'

export default function StatusBadge({ status, size = 'md' }) {
  const meta = STATUS_META[status] || STATUS_META.pendiente
  const dot = status === 'en_camino'
    ? `${meta.dot} animate-pulse`
    : meta.dot

  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full ${meta.color} ${padding}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {meta.label}
    </span>
  )
}
