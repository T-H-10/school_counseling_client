import { createContext, useContext, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem('accessToken') ?? null
  )
  const [user, setUser] = useState(
    () => {
      const saved = localStorage.getItem('user')
      return saved ? JSON.parse(saved) : null
    }
  )

  async function login(username, password) {
    const { data } = await axios.post('http://localhost:8000/token/', {
      username,
      password,
    })
    localStorage.setItem('accessToken', data.access)
    localStorage.setItem('refreshToken', data.refresh)
    localStorage.setItem('user', JSON.stringify({ username }))
    setAccessToken(data.access)
    setUser({ username })
  }

  function logout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    setAccessToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ accessToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
