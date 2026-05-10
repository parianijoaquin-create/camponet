export const PRODUCERS = [
  { id: 'p1', name: 'Martín Ibáñez', company: 'Estancia La Esperanza', location: 'Río Cuarto, Córdoba', cuit: '20-28431567-2', avatar: 'MI', plan: 'Pro' },
  { id: 'p2', name: 'Claudia Ferreyra', company: 'Cooperativa Las Lajas', location: 'Marcos Juárez, Córdoba', cuit: '30-71234568-9', avatar: 'CF', plan: 'Básico' },
  { id: 'p3', name: 'Roberto Agüero', company: 'Agro Don Mario', location: 'Villa María, Córdoba', cuit: '20-19876543-1', avatar: 'RA', plan: 'Pro' },
  { id: 'p4', name: 'Susana Romero', company: 'Establecimiento San Javier', location: 'San Francisco, Córdoba', cuit: '23-33456789-4', avatar: 'SR', plan: 'Pro' },
  { id: 'p5', name: 'Diego Peralta', company: 'Agropecuaria del Centro', location: 'Bell Ville, Córdoba', cuit: '20-41234567-8', avatar: 'DP', plan: 'Básico' },
]

export const TRANSPORTERS = [
  {
    id: 't1', name: 'Juan Pérez', truck: 'Scania R450', plate: 'AE 234 KP',
    capacityTons: 33, location: 'Río Cuarto, Córdoba', rating: 4.9,
    tripsCompleted: 58, insuranceValid: true, docsVerified: true,
    pricePerKm: 380, avatar: 'JP', yearsExp: 12,
    phone: '+54 358 4123456', email: 'jperez@camponet.com.ar',
    specialties: ['granos', 'semillas'],
  },
  {
    id: 't2', name: 'Carlos Medina', truck: 'Mercedes-Benz Actros 2651', plate: 'AC 891 TR',
    capacityTons: 30, location: 'Villa María, Córdoba', rating: 4.7,
    tripsCompleted: 41, insuranceValid: true, docsVerified: true,
    pricePerKm: 350, avatar: 'CM', yearsExp: 8,
    phone: '+54 353 4567890', email: 'cmedina@camponet.com.ar',
    specialties: ['fertilizantes', 'agroquimicos'],
  },
  {
    id: 't3', name: 'Ricardo Soria', truck: 'Iveco Stralis 600', plate: 'AF 102 MN',
    capacityTons: 28, location: 'Córdoba Capital', rating: 4.5,
    tripsCompleted: 27, insuranceValid: true, docsVerified: true,
    pricePerKm: 320, avatar: 'RS', yearsExp: 5,
    phone: '+54 351 4678901', email: 'rsoria@camponet.com.ar',
    specialties: ['granos', 'otros'],
  },
  {
    id: 't4', name: 'Fabiana Torres', truck: 'Volvo FH 540', plate: 'AD 477 QR',
    capacityTons: 35, location: 'Marcos Juárez, Córdoba', rating: 4.8,
    tripsCompleted: 73, insuranceValid: true, docsVerified: true,
    pricePerKm: 400, avatar: 'FT', yearsExp: 15,
    phone: '+54 3472 456789', email: 'ftorres@camponet.com.ar',
    specialties: ['granos', 'semillas', 'fertilizantes'],
  },
  {
    id: 't5', name: 'Hernán Vega', truck: 'Scania G440', plate: 'AB 663 LW',
    capacityTons: 30, location: 'Bell Ville, Córdoba', rating: 4.6,
    tripsCompleted: 35, insuranceValid: true, docsVerified: false,
    pricePerKm: 340, avatar: 'HV', yearsExp: 7,
    phone: '+54 3537 412345', email: 'hvega@camponet.com.ar',
    specialties: ['agroquimicos', 'fertilizantes'],
  },
  {
    id: 't6', name: 'Noemí Quiroga', truck: 'Mercedes-Benz Axor 2544', plate: 'AH 318 ZX',
    capacityTons: 28, location: 'San Francisco, Córdoba', rating: 4.3,
    tripsCompleted: 19, insuranceValid: true, docsVerified: true,
    pricePerKm: 310, avatar: 'NQ', yearsExp: 4,
    phone: '+54 3564 412345', email: 'nquiroga@camponet.com.ar',
    specialties: ['granos', 'otros'],
  },
]

export const ROUTES = {
  'Río Cuarto → Marcos Juárez': { distanceKm: 180, fromCity: 'Río Cuarto', toCity: 'Marcos Juárez' },
  'Córdoba Capital → Villa María': { distanceKm: 150, fromCity: 'Córdoba Capital', toCity: 'Villa María' },
  'Villa María → Bell Ville': { distanceKm: 60, fromCity: 'Villa María', toCity: 'Bell Ville' },
  'San Francisco → Córdoba Capital': { distanceKm: 200, fromCity: 'San Francisco', toCity: 'Córdoba Capital' },
  'Río Cuarto → Córdoba Capital': { distanceKm: 220, fromCity: 'Río Cuarto', toCity: 'Córdoba Capital' },
  'Marcos Juárez → Bell Ville': { distanceKm: 90, fromCity: 'Marcos Juárez', toCity: 'Bell Ville' },
}

export const CARGO_TYPES = ['granos', 'semillas', 'fertilizantes', 'agroquimicos', 'otros']

export const CITIES_CORDOBA = [
  'Córdoba Capital', 'Río Cuarto', 'Villa María', 'Marcos Juárez',
  'San Francisco', 'Bell Ville', 'Jesús María', 'Alta Gracia',
  'Villa Carlos Paz', 'Cruz del Eje',
]


export const SEED_TRIPS = [
  {
    id: 'vj001', producerId: 'p1', transporterId: 't1',
    cargoType: 'granos', origin: 'Río Cuarto', destination: 'Marcos Juárez',
    distanceKm: 180, requiredDate: '2026-05-15',
    weightTons: 30, volume: '90 m³', notes: 'Carga de soja lista para despacho.',
    status: 'en_camino', estimatedCost: 2052000, createdAt: '2026-05-09T08:30:00',
    etaMinutes: 95,
    documents: [
      { name: 'Remito de carga', status: 'verificado' },
      { name: 'Carta de porte electrónica', status: 'verificado' },
      { name: 'Seguro de transporte', status: 'pendiente' },
    ],
  },
  {
    id: 'vj002', producerId: 'p1', transporterId: null,
    cargoType: 'semillas', origin: 'Río Cuarto', destination: 'Córdoba Capital',
    distanceKm: 220, requiredDate: '2026-05-17',
    weightTons: 22, volume: '65 m³', notes: 'Semillas de girasol certificadas.',
    status: 'pendiente', estimatedCost: 1672000, createdAt: '2026-05-09T10:00:00',
    etaMinutes: null,
    documents: [],
  },
  {
    id: 'vj003', producerId: 'p1', transporterId: 't4',
    cargoType: 'fertilizantes', origin: 'Marcos Juárez', destination: 'Bell Ville',
    distanceKm: 90, requiredDate: '2026-05-10',
    weightTons: 28, volume: '50 m³', notes: 'Fertilizante NPK. Carga sensible.',
    status: 'entregado', estimatedCost: 1008000, createdAt: '2026-05-07T09:00:00',
    etaMinutes: 0,
    documents: [
      { name: 'Remito de carga', status: 'verificado' },
      { name: 'Carta de porte electrónica', status: 'verificado' },
      { name: 'Seguro de transporte', status: 'verificado' },
      { name: 'Recibo de entrega', status: 'verificado' },
    ],
  },
  {
    id: 'vj004', producerId: 'p2', transporterId: 't2',
    cargoType: 'agroquimicos', origin: 'Villa María', destination: 'Bell Ville',
    distanceKm: 60, requiredDate: '2026-05-11',
    weightTons: 18, volume: '30 m³', notes: 'Transporte especial. Homologación vigente.',
    status: 'asignado', estimatedCost: 378000, createdAt: '2026-05-09T07:00:00',
    etaMinutes: 55,
    documents: [
      { name: 'Remito de carga', status: 'verificado' },
      { name: 'Habilitación SENASA', status: 'pendiente' },
    ],
  },
  {
    id: 'vj005', producerId: 'p3', transporterId: 't3',
    cargoType: 'granos', origin: 'Córdoba Capital', destination: 'Villa María',
    distanceKm: 150, requiredDate: '2026-05-12',
    weightTons: 25, volume: '75 m³', notes: 'Maíz humedad < 14%.',
    status: 'entregado', estimatedCost: 1200000, createdAt: '2026-05-08T06:00:00',
    etaMinutes: 0,
    documents: [
      { name: 'Remito de carga', status: 'verificado' },
      { name: 'Carta de porte electrónica', status: 'verificado' },
      { name: 'Recibo de entrega', status: 'verificado' },
    ],
  },
  {
    id: 'vj006', producerId: 'p4', transporterId: null,
    cargoType: 'semillas', origin: 'San Francisco', destination: 'Córdoba Capital',
    distanceKm: 200, requiredDate: '2026-05-14',
    weightTons: 20, volume: '60 m³', notes: 'Semillas de soja RR. Prioridad alta.',
    status: 'pendiente', estimatedCost: 1280000, createdAt: '2026-05-09T11:00:00',
    etaMinutes: null,
    documents: [],
  },
  {
    id: 'vj007', producerId: 'p2', transporterId: 't1',
    cargoType: 'granos', origin: 'Marcos Juárez', destination: 'Bell Ville',
    distanceKm: 90, requiredDate: '2026-05-13',
    weightTons: 32, volume: '96 m³', notes: 'Carga completa. Soja.',
    status: 'en_camino', estimatedCost: 1094400, createdAt: '2026-05-09T06:30:00',
    etaMinutes: 42,
    documents: [
      { name: 'Remito de carga', status: 'verificado' },
      { name: 'Carta de porte electrónica', status: 'verificado' },
    ],
  },
  {
    id: 'vj008', producerId: 'p5', transporterId: 't5',
    cargoType: 'fertilizantes', origin: 'Bell Ville', destination: 'Villa María',
    distanceKm: 60, requiredDate: '2026-05-10',
    weightTons: 26, volume: '45 m³', notes: 'Urea granulada.',
    status: 'asignado', estimatedCost: 530400, createdAt: '2026-05-09T09:00:00',
    etaMinutes: 70,
    documents: [
      { name: 'Remito de carga', status: 'pendiente' },
    ],
  },
]
