import { useCallback, useEffect, useState } from 'react'
import { fetchDolarBNA, getRosarioBoard } from '../lib/marketData'

export function useMarketData() {
  const [dolar, setDolar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const d = await fetchDolarBNA()
    setDolar(d)
    if (d.esFallback) setError('No se pudo conectar a dolarapi.com — mostrando valores de referencia.')
    setLoading(false)
  }, [])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load() }, [load])

  const board = dolar ? getRosarioBoard(dolar.venta) : null

  return { dolar, board, loading, error, refresh: load }
}
