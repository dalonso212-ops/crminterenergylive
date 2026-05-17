import { useState } from 'react'
import { X, Plus, Trash2, Check, Pencil } from 'lucide-react'
import { PALETTE } from '../constants.js'

function ColorPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {PALETTE.map(c => (
        <button key={c} onClick={() => onChange(c)}
          className="w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-transform hover:scale-110"
          style={{ backgroundColor: c, borderColor: value === c ? '#0B1F3A' : 'transparent', boxShadow: value === c ? '0 0 0 2px #fff, 0 0 0 4px ' + c : 'none' }}>
          {value === c && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
        </button>
      ))}
    </div>
  )
}

function StateRow({ state, onEdit, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) {
  return (
    <div className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-brand-100 group shadow-niba hover:shadow-niba-lg transition-shadow">
      <div className="flex flex-col gap-0.5 text-gray-300">
        <button onClick={onMoveUp}  disabled={isFirst}  className="leading-none hover:text-brand-500 disabled:opacity-20 transition text-xs">▲</button>
        <button onClick={onMoveDown} disabled={isLast}  className="leading-none hover:text-brand-500 disabled:opacity-20 transition text-xs">▼</button>
      </div>
      <span className="w-4 h-4 rounded-lg flex-shrink-0 shadow-sm" style={{ backgroundColor: state.color }} />
      <span className="flex-1 text-sm font-semibold text-navy-800">{state.label}</span>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
        <button onClick={onEdit}
          className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition">
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button onClick={onDelete}
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

export default function StatesManager({ states, onSave, onClose }) {
  const [list, setList]     = useState([...states])
  const [editing, setEditing] = useState(null)
  const [adding, setAdding]   = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newColor, setNewColor] = useState(PALETTE[3])

  function move(idx, dir) {
    const next = [...list]; [next[idx], next[idx+dir]] = [next[idx+dir], next[idx]]
    setList(next.map((s,i) => ({ ...s, order: i })))
  }
  function del(idx) { setList(l => l.filter((_,i) => i !== idx).map((s,i) => ({ ...s, order: i }))) }
  function startEdit(idx) { setEditing({ idx, label: list[idx].label, color: list[idx].color }) }
  function saveEdit() {
    if (!editing?.label?.trim()) return
    setList(l => l.map((s,i) => i === editing.idx ? { ...s, label: editing.label.trim(), color: editing.color } : s))
    setEditing(null)
  }
  function addState() {
    if (!newLabel.trim()) return
    setList(l => [...l, { id: 'state_' + Date.now(), label: newLabel.trim(), color: newColor, order: l.length }])
    setNewLabel(''); setNewColor(PALETTE[3]); setAdding(false)
  }

  const inputCls = 'w-full px-3.5 py-2.5 rounded-xl border border-brand-200 bg-brand-50/40 text-sm text-navy-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(11,31,58,0.55)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>

      <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] flex flex-col animate-slide-up overflow-hidden"
        style={{ boxShadow: '0 24px 64px rgba(11,31,58,0.28)' }}>

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #0B1F3A, #1A3560)' }} className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Estados de negociación</h2>
              <p className="text-brand-300 text-xs mt-0.5">Personaliza y ordena tus etapas</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4 space-y-2" style={{ background: '#F0F4FF' }}>
          {list.map((st, idx) =>
            editing?.idx === idx ? (
              <div key={st.id} className="p-4 rounded-2xl border-2 bg-white space-y-3" style={{ borderColor: editing.color }}>
                <input autoFocus className={inputCls} value={editing.label}
                  onChange={e => setEditing(p => ({ ...p, label: e.target.value }))}
                  onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditing(null) }}
                  placeholder="Nombre del estado" />
                <ColorPicker value={editing.color} onChange={c => setEditing(p => ({ ...p, color: c }))} />
                <div className="flex gap-2">
                  <button onClick={saveEdit}
                    className="px-4 py-1.5 rounded-xl text-white text-xs font-bold transition hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg,#1D5BB5,#2563EB)' }}>Guardar</button>
                  <button onClick={() => setEditing(null)}
                    className="px-4 py-1.5 rounded-xl border text-xs font-medium hover:bg-gray-50 transition">Cancelar</button>
                </div>
              </div>
            ) : (
              <StateRow key={st.id} state={st}
                onEdit={() => startEdit(idx)} onDelete={() => del(idx)}
                onMoveUp={() => move(idx,-1)} onMoveDown={() => move(idx,1)}
                isFirst={idx === 0} isLast={idx === list.length - 1} />
            )
          )}

          {/* Añadir nuevo */}
          {adding ? (
            <div className="p-4 rounded-2xl border-2 border-dashed border-brand-300 bg-white space-y-3">
              <input autoFocus className={inputCls} value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addState(); if (e.key === 'Escape') setAdding(false) }}
                placeholder="Nombre del nuevo estado" />
              <ColorPicker value={newColor} onChange={setNewColor} />
              <div className="flex gap-2">
                <button onClick={addState}
                  className="px-4 py-1.5 rounded-xl text-white text-xs font-bold transition hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg,#1D5BB5,#2563EB)' }}>Añadir</button>
                <button onClick={() => setAdding(false)}
                  className="px-4 py-1.5 rounded-xl border text-xs font-medium hover:bg-gray-50 transition">Cancelar</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setAdding(true)}
              className="w-full flex items-center gap-2 justify-center p-3.5 rounded-2xl border-2 border-dashed border-brand-200
                text-sm font-semibold text-brand-400 hover:text-brand-600 hover:border-brand-400 hover:bg-white transition">
              <Plus className="w-4 h-4" /> Nuevo estado
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-brand-100 bg-white rounded-b-3xl">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-brand-200 text-sm font-medium text-navy-700 hover:bg-brand-50 transition">
            Cancelar
          </button>
          <button onClick={() => onSave(list)}
            className="px-6 py-2 rounded-xl text-white text-sm font-bold transition-all hover:-translate-y-0.5 shadow-lg shadow-brand-500/30"
            style={{ background: 'linear-gradient(135deg,#1D5BB5,#2563EB)' }}>
            Guardar estados
          </button>
        </div>
      </div>
    </div>
  )
}
