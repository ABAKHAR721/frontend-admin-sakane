'use client'

import { useEffect, useState, useCallback } from 'react'
import axios from '@/services/api/request'
import Table from '@/components/Table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AddCreditsModal from '@/components/AddCreditsModal'
import { useCredit } from '@/contexts/CreditContext'

interface Transaction {
  id: string
  user_id: string
  amount: number
  type: 'purchase' | 'debit'
  description: string
  created_at: string
  status?: string
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { credit, refreshCredit } = useCredit()

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await axios.get('/credits/transactions')
      setTransactions(response.data)
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const columns = [
    {
      key: 'created_at',
      header: 'Date',
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
      key: 'description',
      header: 'Description',
      render: (value: string) => value,
    },
    {
      key: 'type',
      header: 'Type',
      render: (value: string) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            value === 'purchase'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {value === 'purchase' ? 'Crédit' : 'Débit'}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Montant',
      render: (value: number) => (
        <span className={value >= 0 ? 'text-green-600' : 'text-red-600'}>
          {Math.abs(value).toLocaleString('fr-FR', {
            style: 'currency',
            currency: 'MAD',
            maximumFractionDigits: 0,
          })}
        </span>
      ),
    },
  ]

  // Utiliser le solde du contexte au lieu de calculer depuis les transactions
  const totalAmount = credit

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Historique des transactions</CardTitle>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Acheter des crédits
          </button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <span className="text-lg font-medium">
              Solde total:{' '}
              <span
                className={totalAmount >= 0 ? 'text-green-600' : 'text-red-600'}
              >
                {totalAmount.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'MAD',
                  maximumFractionDigits: 0,
                })}
              </span>
            </span>
          </div>
          <Table
            data={transactions}
            columns={columns}
            keyField="id"
            emptyMessage="Aucune transaction trouvée"
          />
        </CardContent>
      </Card>

      <AddCreditsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchTransactions()
          refreshCredit()
        }}
      />
    </div>
  )
}
