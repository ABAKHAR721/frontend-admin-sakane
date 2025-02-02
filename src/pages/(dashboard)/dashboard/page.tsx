'use client'

import { useAuth } from '@/hooks/useAuth'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Bienvenue, {user?.name}!
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>Voici un résumé de votre compte :</p>
              </div>
              <div className="mt-5">
                <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Crédits disponibles
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-indigo-600">
                      {user?.credits}
                    </dd>
                  </div>
                  {/* Ajoutez d'autres statistiques ici */}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
