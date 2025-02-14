'use client'

import { AuthProvider, useAuth } from '@/hooks/useAuth'
import { CreditProvider } from '@/contexts/CreditContext'
import Navigation from '@/components/Navigation'
import { Toaster } from 'react-hot-toast'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

function ClientContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()?.toLowerCase() || ''
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register')
  const isProtectedRoute = pathname.toLowerCase().startsWith('/dashboard') || pathname.toLowerCase().startsWith('/profile')

  // Handle auth redirects only when auth state is loaded
  useEffect(() => {
    if (!loading) {
      const returnTo = new URLSearchParams(window.location.search).get('from')

      if (!user && isProtectedRoute) {
        // Redirect to login if not authenticated and trying to access protected route
        const loginUrl = new URL('/login', window.location.href)
        loginUrl.searchParams.set('from', pathname.toLowerCase())
        router.push(loginUrl.pathname + loginUrl.search)
      } else if (user && isAuthRoute) {
        // Redirect to dashboard or return URL if authenticated and on auth route
        router.push(returnTo || '/dashboard')
      }
    }
  }, [user, loading, isAuthRoute, isProtectedRoute, router, pathname])

  // Show loading state during initial auth check
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
      </div>
    )
  }

  // Show nothing while redirecting on protected routes
  if (!user && isProtectedRoute) {
    return null
  }

  return (
    <CreditProvider>
      <div className="min-h-screen">
        {!isAuthRoute && user && <Navigation />}
        {children}
      </div>
      <Toaster position="top-right" />
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
