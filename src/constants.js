// ─────────────────────────────────────────────────────────────────────────────
// Constantes del CRM Interenergy
// ─────────────────────────────────────────────────────────────────────────────

export const DEFAULT_STATES = [
  { id: 'potencial',        label: 'Potencial',                    color: '#94a3b8', order: 0 },
  { id: 'contactado',       label: 'Contactado',                   color: '#3b82f6', order: 1 },
  { id: 'info_enviada',     label: 'Info / Condiciones enviadas',  color: '#8b5cf6', order: 2 },
  { id: 'en_negociacion',   label: 'En negociación',               color: '#f59e0b', order: 3 },
  { id: 'contrato_enviado', label: 'Contrato enviado',             color: '#f97316', order: 4 },
  { id: 'activo',           label: 'Activo',                       color: '#22c55e', order: 5 },
  { id: 'master',           label: 'Master',                       color: '#1f9560', order: 6 },
  { id: 'sin_respuesta',    label: 'Sin respuesta',                color: '#6b7280', order: 7 },
  { id: 'no_interesado',    label: 'No interesado',                color: '#ef4444', order: 8 },
]

// Paleta blues-first al estilo NIBA
export const PALETTE = [
  '#1D5BB5', '#2563EB', '#3B82F6', '#60A5FA', '#0EA5E9', '#0284C7',
  '#1A3560', '#0B1F3A', '#6366F1', '#8B5CF6',
  '#10B981', '#059669', '#F59E0B', '#F97316',
  '#EF4444', '#6B7280', '#94A3B8',
]

export const CATEGORIAS = [
  'NIBA', 'CHC', 'CANAL', 'POTENCIAL',
  'INSTALADOR', 'PISO TURÍSTICO', 'OTRO',
]
