import { useState, useEffect } from 'react'
import { X, Trash2, MessageSquare, Clock, Plus } from 'lucide-react'
import { CATEGORIAS } from '../constants.js'

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

const EMPTY = {
  nombreFiscal: '', nombreComercial: '', direccion: '',
  poblacion: '', provincia: '',
  emailContacto: '', telefonoContacto: '', personaContacto: '',
  estadoNegociacion: '',
  observaciones: '', fechaSiguienteAccion: '',
  categoria: 'POTENCIAL', notas: [],
}

function Field({ label, children, span2 = false }) {
  return (
    <div className={span2 ? 'sm:col-span-2' : ''}>
      <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const I = 'w-full px-3.5 py-2.5 rounded-xl border-1.5 border-brand-100 bg-brand-50/40 text-sm text-navy-900 placeholder-gray-400 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:bg-white'

export default function ChannelModal({ channel, onClose, onSave, onDelete, currentUser, states }) {
  const isNew = !channel?.id
  const [form, setForm]         = useState(isNew ? { ...EMPTY, estadoNegociacion: states[0]?.id || '' } : { ...channel })
  const [newNote, setNewNote]   = useState('')
  const [saving, setSaving]     = useState(false)
  const [tab, setTab]           = useState('info')
  const [confirmDel, setConfirmDel] = useState(false)

  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const set = (f, v) => setForm(p => ({ ...p, [f]: v }))

  function addNote() {
    if (!newNote.trim()) return
    const note = { id: crypto.randomUUID(), text: newNote.trim(), author: currentUser.name, createdAt: new Date().toISOString() }
    setForm(p => ({ ...p, notas: [note, ...(p.notas || [])] }))
    setNewNote('')
  }

  async function handleSave() {
    if (!form.nombreFiscal.trim()) return
    setSaving(true)
    await onSave({
      ...form,
      id: channel?.id || crypto.randomUUID(),
      createdAt: channel?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: channel?.owner || currentUser.username,
    })
    setSaving(false)
  }

  const activeState = states.find(s => s.id === form.estadoNegociacion)

  const tabs = [
    { id: 'info',        label: 'Ficha' },
    { id: 'negociacion', label: 'Negociación' },
    { id: 'notas',       label: `Notas${form.notas?.length ? ` (${form.notas.length})` : ''}` },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(11,31,58,0.55)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>

      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col animate-slide-up overflow-hidden"
        style={{ boxShadow: '0 24px 64px rgba(11,31,58,0.28)' }}>

        {/* ── Header navy ── */}
        <div style={{ background: 'linear-gradient(135deg, #0B1F3A, #1A3560)' }} className="px-6 pt-5 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">
                {isNew ? 'Nuevo canal de venta' : (form.nombreComercial || form.nombreFiscal)}
              </h2>
              {!isNew && (form.poblacion || form.provincia) && (
                <p className="text-brand-300 text-xs mt-0.5">
                  📍 {[form.poblacion, form.provincia].filter(Boolean).join(', ')}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              {activeState && (
                <span className="text-xs font-bold px-3 py-1 rounded-full text-white/90 border border-white/20"
                  style={{ background: activeState.color + '55' }}>
                  {activeState.label}
                </span>
              )}
              <button onClick={onClose} className="p-1.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex mt-4 gap-1">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition ${
                  tab === t.id
                    ? 'bg-white text-navy-900'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-5 space-y-4">

          {/* FICHA */}
          {tab === 'info' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nombre Fiscal *" span2>
                <input className={I} value={form.nombreFiscal} onChange={e => set('nombreFiscal', e.target.value)} placeholder="Razón social" />
              </Field>
              <Field label="Nombre Comercial">
                <input className={I} value={form.nombreComercial} onChange={e => set('nombreComercial', e.target.value)} placeholder="Nombre comercial" />
              </Field>
              <Field label="Categoría">
                <select className={I} value={form.categoria} onChange={e => set('categoria', e.target.value)}>
                  {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Dirección" span2>
                <input className={I} value={form.direccion} onChange={e => set('direccion', e.target.value)} placeholder="Calle, número, piso…" />
              </Field>
              <Field label="Población">
                <input className={I} value={form.poblacion} onChange={e => set('poblacion', e.target.value)} placeholder="Ciudad" />
              </Field>
              <Field label="Provincia">
                <input className={I} value={form.provincia} onChange={e => set('provincia', e.target.value)} placeholder="Provincia" />
              </Field>
              <Field label="Persona de contacto" span2>
                <input className={I} value={form.personaContacto} onChange={e => set('personaContacto', e.target.value)} placeholder="Nombre y apellido del contacto" />
              </Field>
              <Field label="Email de contacto">
                <input className={I} type="email" value={form.emailContacto} onChange={e => set('emailContacto', e.target.value)} placeholder="email@empresa.com" />
              </Field>
              <Field label="Teléfono de contacto">
                <input className={I} value={form.telefonoContacto} onChange={e => set('telefonoContacto', e.target.value)} placeholder="+34 600 000 000" />
              </Field>
            </div>
          )}

          {/* NEGOCIACIÓN */}
          {tab === 'negociacion' && (
            <div className="space-y-5">
              <Field label="Estado de negociación">
                <div className="grid grid-cols-1 gap-2 mt-1">
                  {states.map(st => (
                    <label key={st.id}
                      className="flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all"
                      style={{
                        borderColor: form.estadoNegociacion === st.id ? st.color : '#E8EEFF',
                        background: form.estadoNegociacion === st.id ? st.color + '12' : '#FAFBFF',
                      }}>
                      <input type="radio" name="estado" value={st.id}
                        checked={form.estadoNegociacion === st.id}
                        onChange={() => set('estadoNegociacion', st.id)}
                        className="sr-only" />
                      <span className="w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-sm" style={{ background: st.color }} />
                      <span className="text-sm font-semibold text-navy-800 flex-1">{st.label}</span>
                      {form.estadoNegociacion === st.id && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: st.color }}>✓</span>
                      )}
                    </label>
                  ))}
                </div>
              </Field>

              <Field label="Observaciones">
                <textarea className={`${I} min-h-[100px] resize-none`}
                  value={form.observaciones}
                  onChange={e => set('observaciones', e.target.value)}
                  placeholder="Contexto de la negociación, condiciones, acuerdos…" />
              </Field>

              <Field label="Fecha de siguiente acción">
                <input className={I} type="date"
                  value={form.fechaSiguienteAccion}
                  onChange={e => set('fechaSiguienteAccion', e.target.value)} />
              </Field>
            </div>
          )}

          {/* NOTAS */}
          {tab === 'notas' && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <textarea className={`${I} flex-1 min-h-[72px] resize-none`}
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  placeholder="Añade una nota, resultado de llamada, próximo paso…"
                  onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) addNote() }} />
                <button onClick={addNote} disabled={!newNote.trim()}
                  className="self-start px-3 py-2.5 rounded-xl text-white font-semibold transition-all disabled:opacity-40 hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg,#1D5BB5,#2563EB)' }}>
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-400">Ctrl/⌘ + Enter para añadir rápidamente</p>

              {(form.notas || []).length === 0 && (
                <div className="text-center py-10 text-gray-300">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Sin notas todavía</p>
                </div>
              )}
              {(form.notas || []).map(note => (
                <div key={note.id} className="rounded-2xl p-4 group border border-brand-100" style={{ background: '#FAFBFF' }}>
                  <p className="text-sm text-navy-800 whitespace-pre-wrap leading-relaxed">{note.text}</p>
                  <div className="flex items-center justify-between mt-2.5">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>{note.author} · {formatDate(note.createdAt)}</span>
                    </div>
                    <button onClick={() => setForm(p => ({ ...p, notas: p.notas.filter(n => n.id !== note.id) }))}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-brand-50 bg-brand-50/30 rounded-b-3xl">
          {!isNew ? (
            confirmDel ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-red-600 font-medium">¿Confirmar borrado?</span>
                <button onClick={() => onDelete(channel.id)} className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition">Sí, borrar</button>
                <button onClick={() => setConfirmDel(false)} className="px-3 py-1.5 rounded-lg border text-xs font-medium hover:bg-gray-50 transition">Cancelar</button>
              </div>
            ) : (
              <button onClick={() => setConfirmDel(true)} className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-600 transition">
                <Trash2 className="w-4 h-4" /> Eliminar
              </button>
            )
          ) : <div />}

          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-xl border border-brand-200 text-sm font-medium text-navy-700 hover:bg-brand-50 transition">
              Cancelar
            </button>
            <button onClick={handleSave} disabled={saving || !form.nombreFiscal.trim()}
              className="px-6 py-2 rounded-xl text-white text-sm font-bold transition-all disabled:opacity-50 hover:-translate-y-0.5 shadow-lg shadow-brand-500/30"
              style={{ background: 'linear-gradient(135deg,#1D5BB5,#2563EB)' }}>
              {saving ? 'Guardando…' : isNew ? 'Crear canal' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
