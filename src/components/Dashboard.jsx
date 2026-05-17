import { useState, useEffect, useCallback } from 'react'
import { Zap, LogOut, Plus, RefreshCw, Search, Settings2, X, Calendar, List, Columns, ChevronDown } from 'lucide-react'
import KanbanBoard from './KanbanBoard.jsx'
import ChannelModal from './ChannelModal.jsx'
import StatesManager from './StatesManager.jsx'
import { fetchData, saveData } from '../api.js'
import { DEFAULT_STATES, CATEGORIAS } from '../constants.js'

// ── Vista lista ───────────────────────────────────────────────────────────────
function ListView({ channels, states, onChannelClick }) {
  const stateMap = Object.fromEntries(states.map(s => [s.id, s]))
  const sorted = [...channels].sort((a, b) => (a.nombreFiscal || '').localeCompare(b.nombreFiscal || ''))

  function formatDate(iso) {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <div className="bg-white rounded-2xl border border-brand-100 overflow-hidden shadow-niba">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: '#0B1F3A' }}>
            {['Nombre fiscal', 'Nombre comercial', 'Población', 'Provincia', 'Contacto', 'Email', 'Teléfono', 'Estado', 'Próx. acción'].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-brand-200 uppercase tracking-wide whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((ch, i) => {
            const st = stateMap[ch.estadoNegociacion]
            const past = ch.fechaSiguienteAccion && new Date(ch.fechaSiguienteAccion) < new Date()
            return (
              <tr key={ch.id} onClick={() => onChannelClick(ch)}
                className="border-b border-brand-50 cursor-pointer transition-colors hover:bg-brand-50/60"
                style={{ background: i % 2 === 0 ? '#FAFBFF' : '#fff' }}>
                <td className="px-4 py-2.5 font-semibold text-navy-900 max-w-[160px] truncate">{ch.nombreFiscal}</td>
                <td className="px-4 py-2.5 text-gray-600 max-w-[140px] truncate">{ch.nombreComercial || '—'}</td>
                <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap">{ch.poblacion || '—'}</td>
                <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap">{ch.provincia || '—'}</td>
                <td className="px-4 py-2.5 text-gray-700 max-w-[120px] truncate">{ch.personaContacto || '—'}</td>
                <td className="px-4 py-2.5 max-w-[160px] truncate">
                  {ch.emailContacto
                    ? <a href={`mailto:${ch.emailContacto}`} onClick={e => e.stopPropagation()} className="text-brand-500 hover:underline">{ch.emailContacto}</a>
                    : <span className="text-gray-400">—</span>}
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap">
                  {ch.telefonoContacto
                    ? <a href={`tel:${ch.telefonoContacto}`} onClick={e => e.stopPropagation()} className="text-brand-500 hover:underline">{ch.telefonoContacto}</a>
                    : <span className="text-gray-400">—</span>}
                </td>
                <td className="px-4 py-2.5">
                  {st
                    ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-white whitespace-nowrap" style={{ backgroundColor: st.color }}>{st.label}</span>
                    : <span className="text-gray-400">—</span>}
                </td>
                <td className={`px-4 py-2.5 text-xs font-medium whitespace-nowrap ${past ? 'text-red-500' : 'text-gray-400'}`}>
                  {formatDate(ch.fechaSiguienteAccion)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {sorted.length === 0 && (
        <div className="py-16 text-center text-gray-400 text-sm">Sin resultados</div>
      )}
    </div>
  )
}

// ── StatsBar ──────────────────────────────────────────────────────────────────
function StatsBar({ channels, states }) {
  const sorted = [...states].sort((a, b) => a.order - b.order)
  return (
    <div className="flex gap-2.5 overflow-x-auto pb-1 mb-6 scrollbar-thin">
      {sorted.map(st => {
        const count = channels.filter(c => c.estadoNegociacion === st.id).length
        return (
          <div key={st.id} className="flex-shrink-0 bg-white rounded-2xl border border-brand-100 px-5 py-3.5 text-center shadow-niba min-w-[96px] group">
            <div className="w-2.5 h-2.5 rounded-full mx-auto mb-2 group-hover:scale-125 transition-transform" style={{ backgroundColor: st.color }} />
            <p className="text-2xl font-extrabold text-navy-900">{count}</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-tight">{st.label}</p>
          </div>
        )
      })}
    </div>
  )
}

// ── NibaSelect — select estilizado ────────────────────────────────────────────
function NibaSelect({ value, onChange, children, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="appearance-none pr-7 pl-3 py-1.5 rounded-lg border border-white/20 bg-white/10 text-white/90
          text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-300 cursor-pointer hover:bg-white/20 transition">
        {children}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/60 pointer-events-none" />
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard({ user, onLogout }) {
  const [channels, setChannels]   = useState([])
  const [states, setStates]       = useState(DEFAULT_STATES)
  const [sha, setSha]             = useState(null)
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')
  const [modal, setModal]         = useState(null)
  const [showStates, setShowStates] = useState(false)
  const [view, setView]           = useState('kanban')
  const [search, setSearch]       = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [filterState, setFilterState] = useState('')
  const [showStats, setShowStats] = useState(true)

  // Carga
  const load = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const data = await fetchData()
      setChannels(data.channels || [])
      setStates(data.states?.length ? data.states : DEFAULT_STATES)
      setSha(data.sha || null)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [])
  useEffect(() => { load() }, [load])

  // Persistencia
  async function persist(ch, st, currentSha) {
    setSaving(true)
    try {
      const { sha: newSha } = await saveData({ channels: ch, states: st, sha: currentSha })
      setSha(newSha)
    } catch (e) { setError('Error al guardar: ' + e.message) }
    finally { setSaving(false) }
  }

  // CRUD
  async function handleSave(channel) {
    const updated = channels.find(c => c.id === channel.id)
      ? channels.map(c => c.id === channel.id ? channel : c)
      : [...channels, channel]
    setChannels(updated); setModal(null)
    await persist(updated, states, sha)
  }
  async function handleDelete(id) {
    const updated = channels.filter(c => c.id !== id)
    setChannels(updated); setModal(null)
    await persist(updated, states, sha)
  }
  async function handleStageChange(channel) {
    const updated = channels.map(c => c.id === channel.id ? channel : c)
    setChannels(updated)
    await persist(updated, states, sha)
  }
  async function handleSaveStates(newStates) {
    setStates(newStates); setShowStates(false)
    await persist(channels, newStates, sha)
  }

  // Filtros
  const filtered = channels.filter(c => {
    if (search) {
      const q = search.toLowerCase()
      if (!['nombreFiscal','nombreComercial','personaContacto','emailContacto','poblacion','provincia','observaciones']
        .some(k => c[k]?.toLowerCase().includes(q))) return false
    }
    if (filterCat   && c.categoria         !== filterCat)   return false
    if (filterState && c.estadoNegociacion  !== filterState) return false
    return true
  })

  const upcoming = channels.filter(c => {
    if (!c.fechaSiguienteAccion) return false
    const d = new Date(c.fechaSiguienteAccion), now = new Date()
    const week = new Date(); week.setDate(week.getDate() + 7)
    return d >= now && d <= week
  })

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F0F4FF' }}>

      {/* ── Navbar NIBA ── */}
      <header className="glass-nav sticky top-0 z-30 border-b border-white/8">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">

          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0 mr-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#1D5BB5,#2563EB)' }}>
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-white font-bold text-sm hidden sm:inline tracking-tight">Interenergy</span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-sm relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar empresa, población…"
              className="w-full pl-9 pr-8 py-1.5 rounded-lg text-sm text-white placeholder-white/40 outline-none border border-white/15 bg-white/10 focus:bg-white/20 focus:border-brand-300 transition"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filtros */}
          <NibaSelect value={filterCat} onChange={setFilterCat} className="hidden md:block">
            <option value="">Todas las categorías</option>
            {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
          </NibaSelect>
          <NibaSelect value={filterState} onChange={setFilterState} className="hidden lg:block">
            <option value="">Todos los estados</option>
            {states.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </NibaSelect>

          <div className="flex items-center gap-1.5 ml-auto">

            {/* Próximas acciones */}
            {upcoming.length > 0 && (
              <span className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                <Calendar className="w-3.5 h-3.5" /> {upcoming.length} próxima{upcoming.length > 1 ? 's' : ''}
              </span>
            )}

            {/* Vista */}
            <div className="flex items-center border border-white/20 rounded-lg overflow-hidden ml-1">
              {[['kanban', Columns], ['list', List]].map(([id, Icon]) => (
                <button key={id} onClick={() => setView(id)}
                  className={`p-2 transition ${view === id ? 'bg-brand-500 text-white' : 'text-white/50 hover:text-white hover:bg-white/10'}`}>
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>

            {/* Gestionar estados */}
            <button onClick={() => setShowStates(true)} title="Gestionar estados"
              className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition">
              <Settings2 className="w-4 h-4" />
            </button>

            {/* Refresh */}
            <button onClick={load} disabled={loading} title="Actualizar"
              className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-300' : ''}`} />
            </button>

            {/* Nuevo canal */}
            <button onClick={() => setModal({ channel: null, stage: states[0]?.id })}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-white text-sm font-semibold shadow-lg shadow-brand-900/40 hover:-translate-y-0.5 hover:shadow-xl transition-all"
              style={{ background: 'linear-gradient(135deg, #1D5BB5, #2563EB)' }}>
              <Plus className="w-4 h-4" /> Nuevo canal
            </button>

            {/* Usuario */}
            <div className="flex items-center gap-2 pl-2 border-l border-white/15">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg,#1D5BB5,#60A5FA)' }}>
                {user.name?.[0]?.toUpperCase()}
              </div>
              <span className="hidden lg:inline text-sm text-white/70 max-w-[80px] truncate">{user.name}</span>
              <button onClick={onLogout} title="Cerrar sesión"
                className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-4 sm:px-6 py-6">

        {/* Error */}
        {error && (
          <div className="mb-4 flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 shadow-niba animate-fade-in">
            <span className="flex-1">{error}</span>
            <button onClick={() => setError('')}><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* Guardando */}
        {saving && (
          <div className="mb-4 flex items-center gap-2 text-sm text-brand-700 bg-brand-50 border border-brand-200 rounded-2xl px-4 py-2.5 shadow-niba animate-fade-in">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-500" />
            <span>Guardando en GitHub…</span>
          </div>
        )}

        {/* Stats */}
        {showStats && <StatsBar channels={channels} states={states} />}

        {/* Count + toggle */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-navy-700/70">
            <span className="font-bold text-navy-900">{filtered.length}</span> canales
            {(search || filterCat || filterState) ? ` de ${channels.length}` : ''}
          </p>
          <button onClick={() => setShowStats(s => !s)}
            className="text-xs text-brand-400 hover:text-brand-600 transition font-medium">
            {showStats ? 'Ocultar estadísticas' : 'Ver estadísticas'}
          </button>
        </div>

        {/* Board / List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-navy-700/40 gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#1D5BB5,#2563EB)' }}>
              <RefreshCw className="w-6 h-6 text-white animate-spin" />
            </div>
            <p className="text-sm font-medium">Cargando canales…</p>
          </div>
        ) : view === 'kanban' ? (
          <KanbanBoard
            channels={filtered}
            states={states}
            onChannelUpdate={handleStageChange}
            onChannelClick={(ch) => setModal({ channel: ch })}
            onAddNew={(stateId) => setModal({ channel: null, stage: stateId })}
          />
        ) : (
          <div className="overflow-x-auto animate-fade-in">
            <ListView channels={filtered} states={states} onChannelClick={(ch) => setModal({ channel: ch })} />
          </div>
        )}
      </main>

      {/* Modales */}
      {modal && (
        <ChannelModal
          channel={modal.channel ?? { estadoNegociacion: modal.stage || states[0]?.id }}
          onClose={() => setModal(null)}
          onSave={handleSave}
          onDelete={handleDelete}
          currentUser={user}
          states={states}
        />
      )}
      {showStates && (
        <StatesManager states={states} onSave={handleSaveStates} onClose={() => setShowStates(false)} />
      )}
    </div>
  )
}
