'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import DataTable from '@/components/DataTable'
import axios from '@/services/api/request'

interface Lead {
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
  status: string
}

export default function LeadsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get('/leads')
        setLeads(response.data)
      } catch (error) {
        console.error('Error fetching leads:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchLeads()
    }
  }, [user])

  useEffect(() => {
    if (leads.length > 0) {
      console.log('Leads data:', leads);
    }
  }, [leads]);

  const columns = [
    {
      key: 'mode',
      header: 'Mode',
      render: (value: string) => value === 'buy' ? 'Achat' : 'Location',
    },
    {
      key: 'type',
      header: 'Type de bien',
      render: (value: string) => value || 'Non spécifié',
    },
    {
      key: 'bedrooms',
      header: 'Chambres',
      render: (value: string) => value ? `${value} ch.` : 'Non spécifié',
    },
    {
      key: 'area',
      header: 'Surface',
      render: (value: string) => value ? `${value} m²` : 'Non spécifié',
    },
    {
      key: 'budget',
      header: 'Budget',
      render: (value: string) => value || '< 3 000 MAD',
    },
    {
      key: 'rental_duration',
      header: 'Durée location',
      render: (value: string) => value || 'N/A',
    },
    {
      key: 'timing',
      header: 'Délai',
      render: (value: string) => value || 'Non spécifié',
    },
    {
      key: 'status',
      header: 'Statut',
      render: (value: string) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            value === 'new'
              ? 'bg-green-100 text-green-800'
              : value === 'purchased'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {value === 'new'
            ? 'Nouveau'
            : value === 'purchased'
            ? 'Acheté'
            : value}
        </span>
      ),
    },
    {
      key: 'created_at',
      header: 'Date de création',
      render: (value: string) =>
        new Date(value).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row: Lead) => (
        <button
          onClick={() => handlePurchase(row.id)}
          className="px-3 py-1 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={row.status !== 'new'}
        >
          Acheter
        </button>
      ),
    },
  ]

  const handlePurchase = async (leadId: string) => {
    try {
      await axios.post(`/leads/${leadId}/purchase`)
      // Rafraîchir la liste après l'achat
      const response = await axios.get('/leads')
      setLeads(response.data)
    } catch (error: any) {
      console.error('Error purchasing lead:', error)
      alert(error.response?.data?.error || 'Erreur lors de l\'achat du lead')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Leads disponibles</h1>
      </div>

      <DataTable
        columns={columns}
        data={leads}
        title="Liste des leads"
        loading={isLoading}
        emptyMessage="Aucun lead disponible"
      />
    </div>
  )
}
