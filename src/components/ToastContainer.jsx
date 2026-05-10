import { useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { CheckCircle, AlertCircle, X } from 'lucide-react'

function Toast({ toast }) {
  const { dispatch } = useApp()

  useEffect(() => {
    const t = setTimeout(() => dispatch({ type: 'REMOVE_TOAST', id: toast.id }), 4000)
    return () => clearTimeout(t)
  }, [toast.id, dispatch])

  const isSuccess = toast.kind !== 'error'
  return (
    <div className={`flex items-start gap-3 p-3.5 rounded-xl shadow-lg border max-w-sm w-full
      ${isSuccess ? 'bg-white border-campo-200' : 'bg-white border-red-200'}`}>
      {isSuccess
        ? <CheckCircle size={18} className="text-campo-600 flex-shrink-0 mt-0.5" />
        : <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />}
      <div className="flex-1 text-sm text-slate-700 font-medium">{toast.message}</div>
      <button
        onClick={() => dispatch({ type: 'REMOVE_TOAST', id: toast.id })}
        className="text-slate-400 hover:text-slate-600 flex-shrink-0"
      >
        <X size={15} />
      </button>
    </div>
  )
}

export default function ToastContainer() {
  const { state } = useApp()
  if (!state.toasts.length) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {state.toasts.map(t => <Toast key={t.id} toast={t} />)}
    </div>
  )
}
