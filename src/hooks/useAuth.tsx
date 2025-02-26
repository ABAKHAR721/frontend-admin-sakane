'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'
import axios from '@/services/api/request'
import * as authService from '@/services/api/authService'

interface User {
  id: string
  name: string
  email: string
  credits?: number
  role?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (data: { name: string; email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.log('useAuth - No token found')
        setUser(null)
        setIsAuthenticated(false)
        setLoading(false)
        return
      }

      console.log('useAuth - Refreshing user')
      const { data } = await axios.get('/auth/me')
      console.log('useAuth - User refreshed:', data.user ? 'Found' : 'Not found')
      setUser(data.user)
      setIsAuthenticated(!!data.user)
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.log('useAuth - Not authenticated')
        localStorage.removeItem('token')
      } else {
        console.error('useAuth - Error refreshing user:', error)
      }
      setUser(null)
      setIsAuthenticated(false)
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
      const response = await authService.login({ email, password })
      console.log('useAuth - Login successful')
      
      if (!response.data) {
        throw new Error('Login response is empty')
      }
      
      // Sauvegarder le token
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
      }
      
      setUser(response.data.user || null)
      setIsAuthenticated(!!response.data.user)
      
      // Rediriger vers la page d'accueil
      window.location.replace('/')
    } catch (error: any) {
      console.log('useAuth - Login failed:', error.response?.data?.message || error.message)
      throw new Error(error.response?.data?.message || 'Erreur de connexion')
    }
  }

  const logout = async () => {
    try {
      // Clear all auth state
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; secure; samesite=strict';
      localStorage.removeItem('token');
      sessionStorage.clear();
      delete axios.defaults.headers.common['Authorization'];
      
      // Clear user state
      setUser(null);
      setIsAuthenticated(false);
      
      // Clear any cached responses
      if ('caches' in window) {
        const cacheNames = await window.caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => window.caches.delete(cacheName))
        );
      }
      
      // Force navigation to login
      window.location.href = '/login';
    } catch (error) {
      console.error('useAuth - Logout error:', error);
      // Even if there's an error, try to clear state and redirect
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = '/login';
    }
  }

  const signup = async (data: { name: string; email: string; password: string }) => {
    try {
      await authService.signup(data)
    } catch (error: any) {
      console.error('Signup error:', error)
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'inscription')
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, signup, logout, refreshUser }}>
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
