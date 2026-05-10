export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      {Icon && (
        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
          <Icon size={26} className="text-slate-400" />
        </div>
      )}
      <div className="text-base font-semibold text-slate-700 mb-1">{title}</div>
      {description && <div className="text-sm text-slate-400 max-w-xs mb-4">{description}</div>}
      {action}
    </div>
  )
}
