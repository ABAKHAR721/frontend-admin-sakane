import { useState } from 'react'
import axios from '@/services/api/request'
import { toast } from 'react-hot-toast'

interface AddCreditsModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const paymentMethods = [
  {
    id: 'bank_transfer',
    name: 'Virement bancaire',
    description: 'RIB: 123456789012345678901234',
  },
  {
    id: 'cashplus',
    name: 'Cashplus',
    description: 'Numéro: 0661234567',
  },
  {
    id: 'card',
    name: 'Carte bancaire',
    description: 'Paiement sécurisé par CMI',
  },
]

export default function AddCreditsModal({
  isOpen,
  onClose,
  onSuccess,
}: AddCreditsModalProps) {
  const [amount, setAmount] = useState('')
  const [selectedMethod, setSelectedMethod] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!amount || !selectedMethod) {
      toast.error('Veuillez remplir tous les champs')
      return
    }

    const amountNumber = parseInt(amount)
    if (isNaN(amountNumber) || amountNumber <= 0) {
      toast.error('Montant invalide')
      return
    }

    setLoading(true)
    try {
      await axios.post('/credits/add', {
        amount: amountNumber,
        paymentMethod: selectedMethod,
      })
      
      toast.success('Demande d\'achat de crédits envoyée avec succès')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error adding credits:', error)
      toast.error('Erreur lors de l\'achat de crédits')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Acheter des crédits</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Montant (MAD)
            </label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Entrez le montant"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Moyen de paiement
            </label>
            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedMethod === method.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={selectedMethod === method.id}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="hidden"
                  />
                  <div>
                    <div className="font-medium">{method.name}</div>
                    <div className="text-sm text-gray-500">
                      {method.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
            >
              {loading ? 'Envoi en cours...' : 'Confirmer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
