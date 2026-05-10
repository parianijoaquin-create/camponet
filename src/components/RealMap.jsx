import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'

// Coordenadas reales lat/lng de las ciudades del seed (Provincia de Córdoba)
const CITY_COORDS = {
  'Córdoba Capital':  [-31.4201, -64.1888],
  'Río Cuarto':       [-33.1232, -64.3493],
  'Villa María':      [-32.4072, -63.2400],
  'Marcos Juárez':    [-32.7000, -62.1000],
  'San Francisco':    [-31.4286, -62.0838],
  'Bell Ville':       [-32.6294, -62.6856],
  'Jesús María':      [-30.9806, -64.0944],
  'Alta Gracia':      [-31.6539, -64.4283],
  'Villa Carlos Paz': [-31.4241, -64.4978],
  'Cruz del Eje':     [-30.7264, -64.8064],
}

// Encuadre aproximado de la provincia de Córdoba
const CORDOBA_BOUNDS = [
  [-35.0, -65.7], // SW
  [-29.5, -61.7], // NE
]

function divIcon(html, className = '') {
  return L.divIcon({
    html,
    className: `cn-marker ${className}`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })
}

const originIcon = divIcon(
  `<div style="width:22px;height:22px;border-radius:50%;background:#16a34a;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
)
const destinationIcon = divIcon(
  `<div style="width:22px;height:22px;border-radius:50%;background:#f97316;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
)
const truckIcon = divIcon(
  `<div style="width:34px;height:34px;border-radius:8px;background:#0f172a;border:2px solid white;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(0,0,0,0.4);color:white;font-size:18px">🚛</div>`,
  'cn-truck',
)

function FitBounds({ from, to }) {
  const map = useMap()
  useEffect(() => {
    if (from && to) {
      const bounds = L.latLngBounds([from, to]).pad(0.6)
      map.fitBounds(bounds, { animate: false })
    } else {
      map.fitBounds(CORDOBA_BOUNDS, { animate: false })
    }
  }, [map, from, to])
  return null
}

function getProgressFromStatus(status) {
  if (status === 'entregado') return 1
  if (status === 'en_camino') return 0.55
  if (status === 'asignado') return 0
  return 0
}

export default function RealMap({ origin, destination, status }) {
  const from = CITY_COORDS[origin] || CITY_COORDS['Córdoba Capital']
  const to = CITY_COORDS[destination] || CITY_COORDS['Marcos Juárez']
  const [progress, setProgress] = useState(getProgressFromStatus(status))

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (status === 'entregado') { setProgress(1); return }
    if (status === 'en_camino') {
      setProgress(0.1)
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 0.9) { clearInterval(interval); return 0.9 }
          return p + 0.005
        })
      }, 120)
      return () => clearInterval(interval)
    }
    setProgress(0)
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [status])

  const truckLat = from[0] + (to[0] - from[0]) * progress
  const truckLng = from[1] + (to[1] - from[1]) * progress
  const showTruck = status === 'asignado' || status === 'en_camino' || status === 'entregado'
  const routeColor = status === 'en_camino' || status === 'entregado' ? '#f97316' : '#94a3b8'

  return (
    <div className="w-full rounded-xl overflow-hidden border border-slate-200" style={{ height: 360 }}>
      <MapContainer
        center={[-32.0, -64.0]}
        zoom={7}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
        attributionControl
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        <FitBounds from={from} to={to} />

        <Polyline
          positions={[from, to]}
          pathOptions={{ color: routeColor, weight: 4, dashArray: '8,8', opacity: 0.85 }}
        />

        <Marker position={from} icon={originIcon}>
          <Popup><strong>Origen:</strong> {origin}</Popup>
        </Marker>

        <Marker position={to} icon={destinationIcon}>
          <Popup><strong>Destino:</strong> {destination}</Popup>
        </Marker>

        {showTruck && (
          <Marker position={[truckLat, truckLng]} icon={truckIcon}>
            <Popup>Transportista en {status === 'entregado' ? 'destino' : 'ruta'}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  )
}
