// ─────────────────────────────────────────────────────────────────────────────
// Netlify Function: /api/channels
// GET  → lee channels.json del repositorio GitHub
// POST → guarda channels.json en el repositorio GitHub
//
// Variables de entorno en Netlify:
//   GITHUB_TOKEN  → Personal Access Token con permisos "repo"
//   GITHUB_OWNER  → usuario/org de GitHub
//   GITHUB_REPO   → nombre del repositorio de datos
// ─────────────────────────────────────────────────────────────────────────────

import { verifyToken } from './auth.js'

const GITHUB_API = 'https://api.github.com'
const FILE_PATH  = 'data/channels.json'

function githubHeaders() {
  return {
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

function repoUrl() {
  return `${GITHUB_API}/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/${FILE_PATH}`
}

async function getData() {
  const res = await fetch(repoUrl(), { headers: githubHeaders() })
  if (res.status === 404) return { channels: [], states: [], sha: null }
  if (!res.ok) throw new Error(`GitHub GET ${res.status}`)
  const file = await res.json()
  const parsed = JSON.parse(Buffer.from(file.content, 'base64').toString('utf8'))
  return { ...parsed, sha: file.sha }
}

async function putData(payload, sha) {
  const content = Buffer.from(
    JSON.stringify({ ...payload, updatedAt: new Date().toISOString() }, null, 2)
  ).toString('base64')

  const res = await fetch(repoUrl(), {
    method: 'PUT',
    headers: githubHeaders(),
    body: JSON.stringify({
      message: `[CRM] ${new Date().toISOString()}`,
      content,
      ...(sha ? { sha } : {}),
    }),
  })
  if (!res.ok) throw new Error(`GitHub PUT ${res.status}: ${await res.text()}`)
  return (await res.json()).content.sha
}

const cors = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors, body: '' }

  const token = (event.headers['authorization'] || '').replace('Bearer ', '')
  if (!verifyToken(token)) return { statusCode: 401, body: JSON.stringify({ error: 'No autorizado' }) }

  try {
    if (event.httpMethod === 'GET') {
      const data = await getData()
      return { statusCode: 200, headers: cors, body: JSON.stringify(data) }
    }

    if (event.httpMethod === 'POST') {
      const { channels, states, sha } = JSON.parse(event.body)
      const newSha = await putData({ channels, states }, sha)
      return { statusCode: 200, headers: cors, body: JSON.stringify({ ok: true, sha: newSha }) }
    }

    return { statusCode: 405, body: 'Method not allowed' }
  } catch (err) {
    console.error(err)
    return { statusCode: 500, headers: cors, body: JSON.stringify({ error: err.message }) }
  }
}
