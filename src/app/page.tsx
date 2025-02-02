'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
      }
    }
  }, [user, loading, router])

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Tableau de bord</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card - Demandes totales */}
        <div className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-14 w-14 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="h-7 w-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div className="ml-6 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Demandes totales
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900 mt-1">
                    0
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Card - En attente */}
        <div className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-14 w-14 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="h-7 w-7 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-6 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    En attente
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900 mt-1">
                    0
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Card - Traitées */}
        <div className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-14 w-14 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="h-7 w-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="ml-6 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Traitées
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900 mt-1">
                    0
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des dernières demandes */}
      <div className="mt-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Dernières demandes
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            <div className="text-center text-gray-500 py-12">
              Aucune demande pour le moment
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
