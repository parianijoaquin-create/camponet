export default function MetricCard({ icon: Icon, label, value, delta, color = 'text-campo-600', bg = 'bg-campo-50' }) {
  return (
    <div className="card p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
        <Icon size={22} className={color} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-2xl font-bold text-slate-900 leading-tight">{value}</div>
        <div className="text-sm text-slate-500 mt-0.5">{label}</div>
        {delta && (
          <div className={`text-xs font-medium mt-1 ${delta.startsWith('+') ? 'text-campo-600' : 'text-red-500'}`}>
            {delta} este mes
          </div>
        )}
      </div>
    </div>
  )
}
