// ─────────────────────────────────────────────────────────────────────────────
// Capa de comunicación con las Netlify Functions
// ─────────────────────────────────────────────────────────────────────────────
const BASE = '/api'

function authHeaders() {
  const token = localStorage.getItem('crm_token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export async function login(username, password) {
  const res = await fetch(`${BASE}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error de autenticación')
  return data // { token, user }
}

// ── Channels + States ─────────────────────────────────────────────────────────
export async function fetchData() {
  const res = await fetch(`${BASE}/channels`, { headers: authHeaders() })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error al cargar datos')
  return data // { channels, states, sha }
}

export async function saveData({ channels, states, sha }) {
  const res = await fetch(`${BASE}/channels`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ channels, states, sha }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error al guardar datos')
  return data // { ok, sha }
}
