import { useState, useEffect } from 'react'
import axios from '@/services/api/request'
import { toast } from 'react-hot-toast'

interface PendingTransaction {
  id: number
  transactionId: number
  userId: string
  userName: string
  userEmail: string
  amount: number
  type: string
  description: string
  status: string
  createdAt: string
  transactionDate: string
}

export default function AdminPendingTransactions() {
  const [transactions, setTransactions] = useState<PendingTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [confirming, setConfirming] = useState<number | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)

  const fetchPendingTransactions = async () => {
    try {
      const response = await axios.get('/api/admin/pending-transactions')
      setTransactions(response.data)
    } catch (error) {
      console.error('Erreur lors du chargement des transactions:', error)
      toast.error('Erreur lors du chargement des transactions')
    } finally {
      setLoading(false)
    }
  }

  const confirmTransaction = async (confirmationId: number) => {
    setConfirming(confirmationId)
    try {
      await axios.post(`/api/admin/confirm-transaction/${confirmationId}`)
      toast.success('Transaction confirmée avec succès')
      fetchPendingTransactions() // Recharger la liste
    } catch (error) {
      console.error('Erreur lors de la confirmation:', error)
      toast.error('Erreur lors de la confirmation de la transaction')
    } finally {
      setConfirming(null)
    }
  }

  const deleteTransaction = async (confirmationId: number) => {
    setDeleting(confirmationId)
    try {
      await axios.delete(`/api/admin/delete-transaction/${confirmationId}`)
      toast.success('Demande supprimée avec succès')
      fetchPendingTransactions() // Recharger la liste
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      toast.error('Erreur lors de la suppression de la demande')
    } finally {
      setDeleting(null)
    }
  }

  useEffect(() => {
    fetchPendingTransactions()
  }, [])

  if (loading) {
    return <div className="p-4">Chargement...</div>
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Transactions en attente</h2>
      
      {transactions.length === 0 ? (
        <p className="text-gray-500">Aucune transaction en attente</p>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="bg-white border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-semibold">{transaction.userName}</span>
                    <span className="text-gray-500">({transaction.userEmail})</span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Montant:</strong> {transaction.amount} MAD</p>
                    <p><strong>Type:</strong> {transaction.type}</p>
                    <p><strong>Description:</strong> {transaction.description}</p>
                    <p><strong>Date:</strong> {new Date(transaction.transactionDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                <div className="ml-4 flex space-x-2">
                  <button
                    onClick={() => confirmTransaction(transaction.id)}
                    disabled={confirming === transaction.id || deleting === transaction.id}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
                  >
                    {confirming === transaction.id ? 'Confirmation...' : 'Confirmer'}
                  </button>
                  <button
                    onClick={() => deleteTransaction(transaction.id)}
                    disabled={deleting === transaction.id || confirming === transaction.id}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
                  >
                    {deleting === transaction.id ? 'Suppression...' : 'Supprimer'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}