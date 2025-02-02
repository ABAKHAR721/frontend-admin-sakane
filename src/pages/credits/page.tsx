import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Historique des Crédits - Sakane Ask',
  description: 'Historique de vos transactions de crédits sur Sakane Ask',
}

export default function CreditsPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Historique des Crédits</h1>
            <p className="mt-2 text-sm text-gray-600">
              Consultez l&apos;historique de vos transactions de crédits
            </p>
          </div>

          {/* Carte de solde */}
          <div className="mb-8 rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-medium text-gray-900">Solde actuel</h2>
            <p className="mt-2 text-3xl font-bold text-blue-600">20 crédits</p>
            <button className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Acheter des crédits
            </button>
          </div>

          {/* Filtres */}
          <div className="mb-6 flex gap-4">
            <select className="rounded-lg border border-gray-300 px-4 py-2">
              <option value="all">Tous les types</option>
              <option value="purchase">Achats</option>
              <option value="usage">Utilisations</option>
            </select>
            <input
              type="date"
              className="rounded-lg border border-gray-300 px-4 py-2"
            />
          </div>

          {/* Tableau des transactions */}
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Montant
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <tr>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    31/01/2025
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Achat
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Achat de 100 crédits
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-green-600">
                    +100
                  </td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    31/01/2025
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                      Utilisation
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Achat du lead #123
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-red-600">
                    -20
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
