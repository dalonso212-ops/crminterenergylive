import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Plus, Phone, Mail, MessageSquare, Calendar, AlertCircle, ChevronDown } from 'lucide-react'

function formatDateShort(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
}
function isPast(iso) { return iso && new Date(iso) < new Date() }

// Convierte hex a rgb para usar en rgba()
function hexRgb(hex) {
  const h = hex.replace('#','')
  return [
    parseInt(h.slice(0,2),16),
    parseInt(h.slice(2,4),16),
    parseInt(h.slice(4,6),16),
  ].join(',')
}

// Determina si el color es oscuro (para elegir texto blanco/negro)
function isDark(hex) {
  const h = hex.replace('#','')
  const r = parseInt(h.slice(0,2),16)
  const g = parseInt(h.slice(2,4),16)
  const b = parseInt(h.slice(4,6),16)
  return (r*299 + g*587 + b*114) / 1000 < 128
}

function ChannelCard({ channel, index, onClick, state }) {
  const past = isPast(channel.fechaSiguienteAccion)
  const rgb  = state ? hexRgb(state.color) : '37,99,235'

  return (
    <Draggable draggableId={channel.id} index={index}>
      {(provided, snap) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(channel)}
          className="bg-white rounded-2xl mb-2.5 cursor-pointer select-none transition-all"
          style={{
            border: snap.isDragging
              ? `2px solid ${state?.color || '#2563EB'}`
              : '1.5px solid #E8EEFF',
            boxShadow: snap.isDragging
              ? `0 12px 32px rgba(${rgb},0.2), 0 4px 8px rgba(${rgb},0.15)`
              : '0 1px 3px rgba(11,31,58,0.06)',
            transform: snap.isDragging ? 'rotate(1.5deg) scale(1.02)' : undefined,
          }}
        >
          {/* Barra de color superior */}
          <div className="h-1 rounded-t-2xl" style={{ background: state?.color || '#2563EB', opacity: 0.7 }} />

          <div className="p-3.5">
            {/* Nombre */}
            <p className="font-bold text-sm text-navy-900 leading-tight line-clamp-1 mb-0.5">
              {channel.nombreComercial || channel.nombreFiscal}
            </p>
            {channel.nombreComercial && channel.nombreFiscal !== channel.nombreComercial && (
              <p className="text-xs text-gray-400 line-clamp-1">{channel.nombreFiscal}</p>
            )}

            {/* Ubicación */}
            {(channel.poblacion || channel.provincia) && (
              <p className="text-xs text-brand-400 font-medium mt-1">
                📍 {[channel.poblacion, channel.provincia].filter(Boolean).join(', ')}
              </p>
            )}

            {/* Contacto */}
            {channel.personaContacto && (
              <p className="text-xs text-gray-600 mt-1.5 font-medium">{channel.personaContacto}</p>
            )}

            {/* Observaciones */}
            {channel.observaciones && (
              <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 italic leading-relaxed">
                {channel.observaciones}
              </p>
            )}

            {/* Footer */}
            <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-gray-50">
              {channel.emailContacto && (
                <a href={`mailto:${channel.emailContacto}`} onClick={e => e.stopPropagation()}
                  title={channel.emailContacto}
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-brand-400 hover:text-brand-600 hover:bg-brand-50 transition">
                  <Mail className="w-3.5 h-3.5" />
                </a>
              )}
              {channel.telefonoContacto && (
                <a href={`tel:${channel.telefonoContacto}`} onClick={e => e.stopPropagation()}
                  title={channel.telefonoContacto}
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-brand-400 hover:text-brand-600 hover:bg-brand-50 transition">
                  <Phone className="w-3.5 h-3.5" />
                </a>
              )}
              {(channel.notas?.length || 0) > 0 && (
                <span className="flex items-center gap-0.5 text-xs text-gray-400 ml-0.5">
                  <MessageSquare className="w-3.5 h-3.5" /> {channel.notas.length}
                </span>
              )}
              {channel.fechaSiguienteAccion && (
                <span className={`ml-auto flex items-center gap-1 text-xs font-semibold rounded-full px-2 py-0.5
                  ${past ? 'bg-red-100 text-red-600' : 'bg-brand-50 text-brand-500'}`}>
                  <Calendar className="w-3 h-3" /> {formatDateShort(channel.fechaSiguienteAccion)}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}

function StageColumn({ state, channels, onCardClick, onAddNew }) {
  const [collapsed, setCollapsed] = useState(false)
  const rgb = hexRgb(state.color)
  const dark = isDark(state.color)

  return (
    <div className="flex flex-col w-72 shrink-0">
      {/* Header */}
      <div
        className="rounded-2xl px-3.5 py-2.5 mb-2.5 flex items-center justify-between"
        style={{ background: state.color }}
      >
        <button onClick={() => setCollapsed(c => !c)} className="flex items-center gap-2.5">
          <span className={`font-bold text-sm ${dark ? 'text-white' : 'text-navy-900'}`}>{state.label}</span>
          <span className={`text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center
            ${dark ? 'bg-white/20 text-white' : 'bg-navy-900/15 text-navy-900'}`}>
            {channels.length}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 transition ${collapsed ? '-rotate-90' : ''} ${dark ? 'text-white/70' : 'text-navy-700'}`} />
        </button>
        <button onClick={() => onAddNew(state.id)}
          className={`w-7 h-7 rounded-xl flex items-center justify-center transition
            ${dark ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-navy-900/10 hover:bg-navy-900/20 text-navy-800'}`}
          title={`Añadir en ${state.label}`}>
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Cards */}
      {!collapsed && (
        <Droppable droppableId={state.id}>
          {(provided, snap) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex-1 min-h-[80px] rounded-2xl px-2 pt-1.5 pb-2 transition-colors"
              style={{
                background: snap.isDraggingOver ? `rgba(${rgb},0.07)` : 'rgba(11,31,58,0.025)',
                outline: snap.isDraggingOver ? `2px solid rgba(${rgb},0.4)` : 'none',
                outlineOffset: '-2px',
              }}
            >
              {channels.map((ch, i) => (
                <ChannelCard key={ch.id} channel={ch} index={i} onClick={onCardClick} state={state} />
              ))}
              {provided.placeholder}
              {channels.length === 0 && !snap.isDraggingOver && (
                <div className="flex flex-col items-center justify-center py-8 text-gray-300 gap-1">
                  <AlertCircle className="w-4 h-4" />
                  <p className="text-xs">Sin canales</p>
                </div>
              )}
            </div>
          )}
        </Droppable>
      )}
    </div>
  )
}

export default function KanbanBoard({ channels, states, onChannelUpdate, onChannelClick, onAddNew }) {
  const stateMap = Object.fromEntries(states.map(s => [s.id, s]))

  function handleDragEnd({ destination, source, draggableId }) {
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return
    const ch = channels.find(c => c.id === draggableId)
    if (!ch) return
    onChannelUpdate({ ...ch, estadoNegociacion: destination.droppableId, updatedAt: new Date().toISOString() })
  }

  const sorted = [...states].sort((a, b) => a.order - b.order)
  const byState = Object.fromEntries(sorted.map(s => [s.id, channels.filter(c => c.estadoNegociacion === s.id)]))
  const unmatched = channels.filter(c => !stateMap[c.estadoNegociacion])
  if (sorted[0]) byState[sorted[0].id] = [...(byState[sorted[0].id] || []), ...unmatched]

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 items-start overflow-x-auto pb-6 scrollbar-thin">
        {sorted.map(state => (
          <StageColumn
            key={state.id}
            state={state}
            channels={byState[state.id] || []}
            onCardClick={onChannelClick}
            onAddNew={onAddNew}
          />
        ))}
      </div>
    </DragDropContext>
  )
}
