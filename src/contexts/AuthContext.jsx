// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('taskos_user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('taskos_token')
    if (token) {
      api.get('/auth/me')
        .then(res => { setUser(res.data); localStorage.setItem('taskos_user', JSON.stringify(res.data)) })
        .catch(() => { localStorage.clear() })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    localStorage.setItem('taskos_token', res.data.token)
    localStorage.setItem('taskos_user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data.user
  }

  const signup = async (name, email, password) => {
    const res = await api.post('/auth/signup', { name, email, password })
    localStorage.setItem('taskos_token', res.data.token)
    localStorage.setItem('taskos_user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data.user
  }

  const logout = () => {
    localStorage.removeItem('taskos_token')
    localStorage.removeItem('taskos_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, isAdmin: user?.role === 'ADMIN' }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
