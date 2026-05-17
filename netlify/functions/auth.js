// ─────────────────────────────────────────────────────────────────────────────
// Netlify Function: /api/auth
// Valida usuario + contraseña y devuelve un token de sesión simple.
//
// USUARIOS: modifica la lista USERS para tus 5 colaboradores.
// Las contraseñas también pueden moverse a variables de entorno de Netlify
// para mayor seguridad (ver README).
// ─────────────────────────────────────────────────────────────────────────────

const USERS = [
  { username: 'diego',   password: 'Interenergy2024!', name: 'Diego Alonso',    role: 'admin' },
  { username: 'usuario2', password: 'Canal2024!',       name: 'Usuario 2',       role: 'comercial' },
  { username: 'usuario3', password: 'Canal2024!',       name: 'Usuario 3',       role: 'comercial' },
  { username: 'usuario4', password: 'Canal2024!',       name: 'Usuario 4',       role: 'comercial' },
  { username: 'usuario5', password: 'Canal2024!',       name: 'Usuario 5',       role: 'comercial' },
]

// Token simple basado en base64 (suficiente para una app interna privada).
// Para producción crítica considera JWT con secreto en env var.
function generateToken(user) {
  const payload = { username: user.username, name: user.name, role: user.role, ts: Date.now() }
  return Buffer.from(JSON.stringify(payload)).toString('base64')
}

export function verifyToken(token) {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf8'))
    // Token válido 30 días
    if (Date.now() - payload.ts > 30 * 24 * 60 * 60 * 1000) return null
    return payload
  } catch {
    return null
  }
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Método no permitido' }) }
  }

  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Body inválido' }) }
  }

  const { username, password } = body
  const user = USERS.find(u => u.username === username && u.password === password)

  if (!user) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Usuario o contraseña incorrectos' }),
    }
  }

  const token = generateToken(user)

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token,
      user: { username: user.username, name: user.name, role: user.role },
    }),
  }
}
