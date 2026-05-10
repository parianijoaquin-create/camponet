import { ROSARIO_BOARD, DOLAR_BNA_FALLBACK } from '../data/marketSeed'

// API pública sin auth ni CORS issues. Devuelve { compra, venta, fechaActualizacion, ... }
const DOLAR_BNA_URL = 'https://dolarapi.com/v1/dolares/oficial'

export async function fetchDolarBNA() {
  try {
    const res = await fetch(DOLAR_BNA_URL, { cache: 'no-store' })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    const data = await res.json()
    return {
      compra: Number(data.compra),
      venta: Number(data.venta),
      fechaActualizacion: data.fechaActualizacion || null,
      esFallback: false,
    }
  } catch (err) {
    return { ...DOLAR_BNA_FALLBACK, error: err.message }
  }
}

// La pizarra de Rosario no tiene API pública. Usamos el seed local y enriquecemos
// cada commodity con su precio en ARS según la cotización venta del BNA.
export function getRosarioBoard(dolarVenta) {
  return {
    ...ROSARIO_BOARD,
    commodities: ROSARIO_BOARD.commodities.map(c => ({
      ...c,
      arsPorTonelada: Math.round(c.usdPorTonelada * dolarVenta),
    })),
  }
}
