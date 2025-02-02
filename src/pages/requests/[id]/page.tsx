'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

interface PropertyRequest {
  id: number
  createdAt: string
  status: string
  mode: string
  type: string
  bedrooms: string
  area: string
  budget: string
  rentalDuration: string
  timing: string
  address: string
  latitude: number
  longitude: number
  contactName: string
  contactEmail: string
  contactPhone: string
  rawData: any
}

export default function RequestDetail() {
  const params = useParams()
  const router = useRouter()
  const [request, setRequest] = useState<PropertyRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentStatus, setCurrentStatus] = useState('')

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await fetch(`/api/property-requests/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch request')
        }
        const data = await response.json()
        setRequest(data.data)
        setCurrentStatus(data.data.status)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load request')
      } finally {
        setLoading(false)
      }
    }

    fetchRequest()
  }, [params.id])

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/property-requests/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      setCurrentStatus(newStatus)
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error || !request) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading request</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Détails de la demande
            </h3>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Statut:</span>
              <select
                value={currentStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="pending">En attente</option>
                <option value="contacted">Client contacté</option>
                <option value="processing">En cours</option>
                <option value="completed">Terminé</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Date de la demande</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(request.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </dd>
            </div>

            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Type de demande</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {request.mode} - {request.type}
              </dd>
            </div>

            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Détails du bien</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul>
                  <li>Chambres: {request.bedrooms}</li>
                  <li>Surface: {request.area} m²</li>
                  <li>Budget: {request.budget}</li>
                  {request.rentalDuration && (
                    <li>Durée de location: {request.rentalDuration}</li>
                  )}
                  <li>Timing: {request.timing}</li>
                </ul>
              </dd>
            </div>

            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Localisation</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <p>{request.address}</p>
                <div className="mt-2">
                  <a
                    href={`https://www.google.com/maps?q=${request.latitude},${request.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Voir sur Google Maps
                  </a>
                </div>
              </dd>
            </div>

            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Contact</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul>
                  <li>Nom: {request.contactName}</li>
                  <li>Email: {request.contactEmail}</li>
                  <li>Téléphone: {request.contactPhone}</li>
                </ul>
                <div className="mt-4 space-x-4">
                  <a
                    href={`mailto:${request.contactEmail}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Envoyer un email
                  </a>
                  <a
                    href={`tel:${request.contactPhone}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                  >
                    Appeler
                  </a>
                </div>
              </dd>
            </div>

            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Données brutes</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(request.rawData, null, 2)}
                </pre>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
