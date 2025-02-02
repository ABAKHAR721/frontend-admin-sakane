'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import CreditBalance from '@/components/dashboard/CreditBalance'

interface PropertyRequest {
  id: number
  createdAt: string
  status: string
  type: string
  mode: string
  area: string
  budget: string
  address: string
}

export default function LeadsPage() {
  const { user, refreshUser } = useAuth()
  const [leads, setLeads] = useState<PropertyRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [purchaseInProgress, setPurchaseInProgress] = useState<number | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedLead, setSelectedLead] = useState<number | null>(null)

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads')
      if (!response.ok) {
        throw new Error('Failed to fetch leads')
      }
      const data = await response.json()
      setLeads(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leads')
    } finally {
      setLoading(false)
    }
  }

  const handlePurchaseClick = (leadId: number) => {
    if (user?.credits && user.credits < 20) {
      alert('Vous n\'avez pas assez de crédits pour acheter ce lead')
      return
    }
    setSelectedLead(leadId)
    setShowConfirmModal(true)
  }

  const confirmPurchase = async () => {
    if (!selectedLead) return

    setPurchaseInProgress(selectedLead)
    try {
      const response = await fetch('/api/leads/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leadId: selectedLead }),
      })

      if (!response.ok) {
        throw new Error('Failed to purchase lead')
      }

      await refreshUser() // Mettre à jour les crédits de l'utilisateur
      setShowConfirmModal(false)
      window.location.href = `/requests/${selectedLead}` // Rediriger vers les détails
    } catch (err) {
      alert('Une erreur est survenue lors de l\'achat du lead')
    } finally {
      setPurchaseInProgress(null)
      setSelectedLead(null)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 overflow-y-auto">
          <div className="bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading leads</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <CreditBalance />
          </div>

          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold leading-6 text-gray-900">
                Leads disponibles
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                Liste des demandes de propriétés disponibles à l'achat
              </p>
            </div>
          </div>

          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Date
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Type
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Mode
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Surface
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Budget
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Localisation
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {new Date(lead.createdAt).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{lead.type}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{lead.mode}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{lead.area}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{lead.budget}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {lead.address}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              onClick={() => handlePurchaseClick(lead.id)}
                              disabled={purchaseInProgress === lead.id}
                              className={`text-white px-4 py-2 rounded-md ${
                                purchaseInProgress === lead.id
                                  ? 'bg-gray-400 cursor-not-allowed'
                                  : 'bg-green-600 hover:bg-green-700'
                              }`}
                            >
                              {purchaseInProgress === lead.id ? (
                                <span className="flex items-center">
                                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  En cours...
                                </span>
                              ) : (
                                'Acheter (20 crédits)'
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                      {leads.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-4 text-center text-sm text-gray-500">
                            Aucun lead disponible
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Modal de confirmation */}
          {showConfirmModal && (
            <div className="fixed z-10 inset-0 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                  <div>
                    <div className="mt-3 text-center sm:mt-5">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Confirmer l'achat
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Voulez-vous acheter ce lead pour 20 crédits ? Cette action est irréversible.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                      onClick={confirmPurchase}
                    >
                      Confirmer l'achat
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                      onClick={() => {
                        setShowConfirmModal(false)
                        setSelectedLead(null)
                      }}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
