'use client'

import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { useCredit } from '@/contexts/CreditContext'

import { usePathname } from 'next/navigation'

const AUTH_PATHS = ['/login', '/signup', '/forgot-password']

export default function Navigation() {
  const { user, logout } = useAuth()
  const { credit } = useCredit()
  const pathname = usePathname()

  // Don't render navigation on auth pages
  if (AUTH_PATHS.includes(pathname)) {
    return null
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-gray-900">Sakane Ask</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/dashboard"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/leads"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Leads
              </Link>
              <Link
                href="/myleads"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Mes Leads
              </Link>
              <Link
                href="/credits/transactions"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Transactions
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="ml-3 relative">
              <div className="flex items-center">
                <div className="flex items-center mr-4">
                  <span className="text-gray-700 text-sm font-medium mr-2">
                    {user?.email}
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    {credit.toLocaleString('fr-FR', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 })}
                  </span>
                </div>
                <button
                  onClick={() => logout()}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
