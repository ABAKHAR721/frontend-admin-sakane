'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import axios from '@/services/api/request'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LEAD_STATUS, LeadStatusType } from '@/constants/leadStatus'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { toast } from 'react-hot-toast'
import { LatLngExpression } from 'leaflet'
import type { MapProps } from '@/components/Map'

// Leaflet initialization will be done in useEffect

const Map = dynamic<MapProps>(() => import('@/components/Map').then(mod => mod.Map), { ssr: false })

interface Lead {
  id: string
  user_id: string
  lead_id: string
  status: LeadStatusType
  purchased_at: string
  lead: {
    id: string
    mode: string
    type: string
    bedrooms: string
    area: string
    budget: string
    rental_duration: string
    timing: string
    address: string
    contact_name: string
    contact_email: string
    contact_phone: string
    created_at: string
    latitude?: number
    longitude?: number
  }
}

function LeadDetail({ id }: { id: string }) {
  const [lead, setLead] = useState<Lead | null>(null)

  useEffect(() => {
    // Fix for default marker icon in Leaflet
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/marker-icon-2x.png',
      iconUrl: '/marker-icon.png',
      shadowUrl: '/marker-shadow.png',
    })
  }, [])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const { data } = await axios.get(`/myleads/${id}`)
        setLead(data)
      } catch (error) {
        console.error('Error fetching lead:', error)
        toast.error('Erreur lors du chargement du lead')
      } finally {
        setLoading(false)
      }
    }

    fetchLead()
  }, [id])

  const handleStatusChange = async (newStatus: LeadStatusType) => {
    try {
      await axios.put(`/myleads/${id}/status`, {
        status: newStatus
      })
      setLead(lead => lead ? { ...lead, status: newStatus } : null)
      toast.success('Statut mis à jour avec succès')
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Erreur lors de la mise à jour du statut')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">Lead non trouvé</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => router.push('/myleads')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Retour à la liste
        </button>

        <select
          value={lead.status}
          onChange={(e) => handleStatusChange(e.target.value as LeadStatusType)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {(Object.entries(LEAD_STATUS) as [LeadStatusType, string][]).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détails du lead</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500">Nom</label>
                  <p className="font-medium">{lead.lead.contact_name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="font-medium">{lead.lead.contact_email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Téléphone</label>
                  <p className="font-medium">{lead.lead.contact_phone}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Détails du projet</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500">Mode</label>
                  <p className="font-medium">{lead.lead.mode === 'buy' ? 'Achat' : 'Location'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Type de bien</label>
                  <p className="font-medium">{lead.lead.type}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Adresse</label>
                  <p className="font-medium">{lead.lead.address}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Budget</label>
                  <p className="font-medium">{lead.lead.budget}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Surface</label>
                  <p className="font-medium">{lead.lead.area} m²</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Chambres</label>
                  <p className="font-medium">{lead.lead.bedrooms}</p>
                </div>
              </div>
            </div>
          </div>

          {lead.lead.latitude && lead.lead.longitude && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Localisation</h3>
              <Map 
                latitude={lead.lead.latitude} 
                longitude={lead.lead.longitude} 
                address={lead.lead.address} 
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default LeadDetail;
