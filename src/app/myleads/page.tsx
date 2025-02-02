'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import DataTable from '@/components/DataTable'
import axios from '@/services/api/request'
import Link from 'next/link'

interface MyLead {
  id: string
  user_id: string
  lead_id: string
  status: string
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
    status: string
  }
}

export default function MyLeadsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [myLeads, setMyLeads] = useState<MyLead[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchMyLeads = async () => {
      try {
        const response = await axios.get('/myleads')
        setMyLeads(response.data)
      } catch (error) {
        console.error('Error fetching my leads:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchMyLeads()
    }
  }, [user])

  const columns = [
    {
      key: 'contact_name',
      header: 'Nom du contact',
      render: (_, row: MyLead) => row.lead.contact_name || 'Non spécifié',
    },
    {
      key: 'contact_email',
      header: 'Email',
      render: (_, row: MyLead) => row.lead.contact_email || 'Non spécifié',
    },
    {
      key: 'contact_phone',
      header: 'Téléphone',
      render: (_, row: MyLead) => row.lead.contact_phone || 'Non spécifié',
    },
    {
      key: 'mode',
      header: 'Mode',
      render: (_, row: MyLead) => row.lead.mode === 'buy' ? 'Achat' : 'Location',
    },
    {
      key: 'type',
      header: 'Type de bien',
      render: (_, row: MyLead) => row.lead.type || 'Non spécifié',
    },
    {
      key: 'bedrooms',
      header: 'Chambres',
      render: (_, row: MyLead) => row.lead.bedrooms ? `${row.lead.bedrooms} ch.` : 'Non spécifié',
    },
    {
      key: 'area',
      header: 'Surface',
      render: (_, row: MyLead) => row.lead.area ? `${row.lead.area} m²` : 'Non spécifié',
    },
    {
      key: 'budget',
      header: 'Budget',
      render: (_, row: MyLead) => row.lead.budget || '< 3 000 MAD',
    },
    {
      key: 'rental_duration',
      header: 'Durée location',
      render: (_, row: MyLead) => row.lead.rental_duration || 'N/A',
    },
    {
      key: 'timing',
      header: 'Délai',
      render: (_, row: MyLead) => row.lead.timing || 'Non spécifié',
    },
    {
      key: 'address',
      header: 'Adresse',
      render: (_, row: MyLead) => row.lead.address || 'Non spécifié',
    },
    {
      key: 'status',
      header: 'Statut',
      render: (value: string) => {
        const statusColors: { [key: string]: string } = {
          'Nouveau': 'bg-yellow-100 text-yellow-800',
          'Contacté': 'bg-blue-100 text-blue-800',
          'Email envoyé': 'bg-indigo-100 text-indigo-800',
          'Rendez-vous programmé': 'bg-purple-100 text-purple-800',
          'Rendez-vous effectué': 'bg-pink-100 text-pink-800',
          'Proposition envoyée': 'bg-orange-100 text-orange-800',
          'En négociation': 'bg-cyan-100 text-cyan-800',
          'Gagné': 'bg-green-100 text-green-800',
          'Perdu': 'bg-red-100 text-red-800',
          'Pas intéressé': 'bg-gray-100 text-gray-800'
        };

        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              statusColors[value] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {value}
          </span>
        );
      },
    },
    {
      key: 'purchased_at',
      header: 'Date d\'achat',
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
      render: (_, row: MyLead) => (
        <div className="space-x-2">
          <Link
            href={`/myleads/${row.id}`}
            className="px-3 py-1 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Détails
          </Link>
          <button
            onClick={() => handleRemove(row.id)}
            className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Supprimer
          </button>
        </div>
      ),
    },
  ]

  const [statusList, setStatusList] = useState<string[]>([])

  useEffect(() => {
    const fetchStatusList = async () => {
      try {
        const response = await axios.get('/myleads/status/list')
        setStatusList(response.data)
      } catch (error) {
        console.error('Error fetching status list:', error)
      }
    }

    fetchStatusList()
  }, [])

  const handleUpdateStatus = async (leadId: string) => {
    const newStatus = prompt('Nouveau statut :', statusList.join(', '))
    if (!newStatus || !statusList.includes(newStatus)) return

    try {
      await axios.put(`/myleads/${leadId}/status`, { status: newStatus })
      const response = await axios.get('/myleads')
      setMyLeads(response.data)
    } catch (error) {
      console.error('Error updating lead status:', error)
      alert('Erreur lors de la mise à jour du statut')
    }
  }

  const handleRemove = async (leadId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce lead ?')) return

    try {
      await axios.delete(`/myleads/${leadId}`)
      const response = await axios.get('/myleads')
      setMyLeads(response.data)
    } catch (error) {
      console.error('Error removing lead:', error)
      alert('Erreur lors de la suppression du lead')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Mes leads</h1>

      <DataTable
        columns={columns}
        data={myLeads}
        title="Liste de mes leads"
        loading={isLoading}
        emptyMessage="Aucun lead assigné"
      />
    </div>
  )
}
