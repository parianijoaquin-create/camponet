export default function MetricCard({ icon: Icon, label, value, delta, color = 'text-campo-600', bg = 'bg-campo-50' }) {
  return (
    <div className="card p-4 sm:p-5 flex flex-col sm:flex-row items-start gap-2 sm:gap-4">
      <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
        <Icon size={22} className={color} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight truncate">{value}</div>
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
