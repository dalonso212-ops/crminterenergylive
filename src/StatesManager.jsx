import { useState } from 'react'
import { Eye, EyeOff, Loader2, Zap } from 'lucide-react'
import { login } from '../api.js'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { token, user } = await login(username, password)
      localStorage.setItem('crm_token', token)
      localStorage.setItem('crm_user', JSON.stringify(user))
      onLogin(user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(160deg, #040D1A 0%, #0B1F3A 45%, #1A3560 75%, #1D5BB5 100%)' }}>

      {/* Panel izquierdo — branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 px-16 py-14">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">Interenergy</span>
        </div>

        {/* Hero copy */}
        <div className="animate-fade-in">
          <p className="text-brand-300 text-sm font-semibold uppercase tracking-widest mb-4">CRM Canales de Venta</p>
          <h1 className="text-white text-5xl font-extrabold leading-tight mb-6">
            Gestiona tus<br />
            <span className="text-gradient">canales de<br />energía</span>
          </h1>
          <p className="text-brand-200/70 text-lg leading-relaxed max-w-md">
            Pipeline de negociación, seguimiento de potenciales y gestión de estados en un solo lugar.
          </p>
        </div>

        {/* Stats decorativos */}
        <div className="flex gap-8">
          {[['946', 'Canales'], ['9', 'Estados'], ['5', 'Usuarios']].map(([n, l]) => (
            <div key={l}>
              <p className="text-white text-3xl font-bold">{n}</p>
              <p className="text-brand-300/70 text-sm">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-slide-up">

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-niba-lg overflow-hidden">

            {/* Header azul */}
            <div className="px-8 pt-8 pb-6" style={{ background: 'linear-gradient(135deg, #1D5BB5, #2563EB)' }}>
              {/* Logo mobile */}
              <div className="flex items-center gap-2 mb-6 lg:hidden">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-bold">Interenergy</span>
              </div>
              <h2 className="text-white text-2xl font-bold">Bienvenido</h2>
              <p className="text-blue-100 text-sm mt-1">Accede a tu CRM de canales de venta</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-navy-800 uppercase tracking-wider mb-2">
                  Usuario
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="tu usuario"
                  required
                  autoComplete="username"
                  className="niba-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800 uppercase tracking-wider mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="niba-input pr-11"
                  />
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-500 transition">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <span className="text-red-500">⚠</span> {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all
                  flex items-center justify-center gap-2 shadow-lg shadow-brand-500/30
                  disabled:opacity-60 hover:shadow-xl hover:shadow-brand-500/40 hover:-translate-y-0.5 active:translate-y-0"
                style={{ background: 'linear-gradient(135deg, #1D5BB5, #2563EB)' }}>
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Accediendo…' : 'Iniciar sesión →'}
              </button>
            </form>
          </div>

          <p className="text-center text-brand-200/50 text-xs mt-6">
            Interenergy · CRM Canales de Venta · Uso interno
          </p>
        </div>
      </div>

      {/* Input styles globales */}
      <style>{`
        .niba-input {
          width: 100%;
          padding: .625rem .875rem;
          border-radius: .75rem;
          border: 1.5px solid #E2E8F0;
          font-size: .875rem;
          outline: none;
          transition: border-color .15s, box-shadow .15s;
          color: #0B1F3A;
          background: #FAFBFF;
        }
        .niba-input:focus {
          border-color: #2563EB;
          box-shadow: 0 0 0 3px rgba(37,99,235,.12);
          background: #fff;
        }
        .niba-input::placeholder { color: #94A3B8; }
      `}</style>
    </div>
  )
}
