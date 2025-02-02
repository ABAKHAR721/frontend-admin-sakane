'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import prisma from '@/lib/db'

interface PropertyRequest {
  id: number
  createdAt: string
  status: string
  type: string
  mode: string
  contactName: string
  contactEmail: string
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<PropertyRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        console.log('Fetching requests...')
        const response = await fetch('/api/property-requests')
        if (!response.ok) {
          throw new Error('Failed to fetch requests')
        }
        const data = await response.json()
        console.log('Received requests:', data)
        setRequests(data.data)
      } catch (err) {
        console.error('Error fetching requests:', err)
        setError(err instanceof Error ? err.message : 'Failed to load requests')
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading requests</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Demandes de propriétés</h1>
          <p className="mt-2 text-sm text-gray-700">
            Liste de toutes les demandes de recherche de propriétés
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
                      Contact
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {requests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {new Date(request.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{request.type}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{request.mode}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {request.contactName} ({request.contactEmail})
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                            request.status === 'pending'
                              ? 'bg-yellow-50 text-yellow-800 ring-1 ring-inset ring-yellow-600/20'
                              : request.status === 'processing'
                              ? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10'
                              : request.status === 'contacted'
                              ? 'bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-700/10'
                              : request.status === 'completed'
                              ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
                              : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
                          }`}
                        >
                          {request.status === 'pending' && 'En attente'}
                          {request.status === 'processing' && 'En cours'}
                          {request.status === 'contacted' && 'Contacté'}
                          {request.status === 'completed' && 'Terminé'}
                          {request.status === 'cancelled' && 'Annulé'}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link
                          href={`/requests/${request.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Voir les détails
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {requests.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-sm text-gray-500">
                        Aucune demande trouvée
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
