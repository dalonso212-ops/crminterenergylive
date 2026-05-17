import { useState, useEffect } from 'react'
import Login from './components/Login.jsx'
import Dashboard from './components/Dashboard.jsx'

export default function App() {
  const [user, setUser] = useState(null)
  const [booting, setBooting] = useState(true)

  // Restaurar sesión del localStorage
  useEffect(() => {
    const stored = localStorage.getItem('crm_user')
    const token  = localStorage.getItem('crm_token')
    if (stored && token) {
      try {
        setUser(JSON.parse(stored))
      } catch {}
    }
    setBooting(false)
  }, [])

  function handleLogin(user) {
    setUser(user)
  }

  function handleLogout() {
    localStorage.removeItem('crm_token')
    localStorage.removeItem('crm_user')
    setUser(null)
  }

  if (booting) return null

  if (!user) return <Login onLogin={handleLogin} />

  return <Dashboard user={user} onLogout={handleLogout} />
}
