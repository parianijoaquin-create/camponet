// Pizarra Rosario (BCR) — valores referenciales en USD por tonelada.
// No hay API pública abierta del BCR/Matba-Rofex; estos valores se actualizan
// manualmente para reflejar precios típicos del mercado de granos de Rosario.
// El precio en ARS se calcula en runtime usando la cotización venta del BNA.

export const ROSARIO_BOARD = {
  fechaPizarra: '2026-05-09',
  fuente: 'Bolsa de Comercio de Rosario (BCR)',
  commodities: [
    { id: 'soja',     nombre: 'Soja',     emoji: '🌱', usdPorTonelada: 305, variacion: +2.5 },
    { id: 'maiz',     nombre: 'Maíz',     emoji: '🌽', usdPorTonelada: 175, variacion: -1.0 },
    { id: 'trigo',    nombre: 'Trigo',    emoji: '🌾', usdPorTonelada: 215, variacion: +0.8 },
    { id: 'girasol',  nombre: 'Girasol',  emoji: '🌻', usdPorTonelada: 380, variacion: +3.2 },
    { id: 'sorgo',    nombre: 'Sorgo',    emoji: '🌾', usdPorTonelada: 165, variacion: -0.5 },
  ],
}

// Fallback offline para el dólar BNA cuando no hay red.
export const DOLAR_BNA_FALLBACK = {
  compra: 1180,
  venta: 1220,
  fechaActualizacion: null,
  esFallback: true,
}
