'use client'

import { AuthProvider, useAuth } from '@/hooks/useAuth'
import { CreditProvider } from '@/contexts/CreditContext'
import { Toaster } from 'react-hot-toast'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

// Ajout MUI
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const theme = createTheme(); // Tu peux customiser ton thème ici

function ClientContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()?.toLowerCase() || ''
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register')
  const isProtectedRoute = pathname.startsWith('/admin') || pathname.startsWith('/profile')

  // Gestion de la redirection en fonction de l'authentification
  useEffect(() => {
    if (!loading) {
      const returnTo = new URLSearchParams(window.location.search).get('from')

      if (!user && isProtectedRoute) {
        const loginUrl = new URL('/login', window.location.href)
        loginUrl.searchParams.set('from', pathname)
        router.push(loginUrl.pathname + loginUrl.search)
      }
      else if (user && isAuthRoute) {
        router.push(returnTo || '/admin/dashboard')
      }
    }
  }, [user, loading, isAuthRoute, isProtectedRoute, router, pathname])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
      </div>
    )
  }

  if (!user && isProtectedRoute) {
    return null
  }

  return (
    <CreditProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="min-h-screen">
            {children}
          </div>
          <Toaster position="top-right" />
        </LocalizationProvider>
      </ThemeProvider>
    </CreditProvider>
  )
}

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <ClientContent>{children}</ClientContent>
    </AuthProvider>
  )
}