'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'
import axios from '@/services/api/request'

interface User {
  id: number
  name: string
  email: string
  credits: number
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.log('useAuth - No token found')
        setUser(null)
        setLoading(false)
        return
      }

      console.log('useAuth - Refreshing user')
      const { data } = await axios.get('/auth/me')
      console.log('useAuth - User refreshed:', data.user ? 'Found' : 'Not found')
      setUser(data.user)
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.log('useAuth - Not authenticated')
        localStorage.removeItem('token')
      } else {
        console.error('useAuth - Error refreshing user:', error)
      }
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      console.log('useAuth - Login attempt')
      const { data } = await axios.post('/auth/login', { email, password })
      console.log('useAuth - Login successful')
      
      // Sauvegarder le token
      if (data.token) {
        localStorage.setItem('token', data.token)
      }
      
      setUser(data.user)
      
      // Rediriger vers la page d'accueil
      window.location.replace('/')
    } catch (error: any) {
      console.log('useAuth - Login failed:', error.response?.data?.message || error.message)
      throw new Error(error.response?.data?.message || 'Erreur de connexion')
    }
  }

  const logout = async () => {
    try {
      console.log('useAuth - Logout')
      await axios.post('/auth/logout')
      setUser(null)
      window.location.replace('/login')
    } catch (error) {
      console.error('useAuth - Logout error:', error)
      // Même en cas d'erreur, on déconnecte l'utilisateur localement
      setUser(null)
      window.location.replace('/login')
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
