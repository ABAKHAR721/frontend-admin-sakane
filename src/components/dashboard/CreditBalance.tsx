'use client'

import { useAuth } from '@/hooks/useAuth'
import { useEffect, useState } from 'react';

export default function CreditBalance() {
  const { user } = useAuth()
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await fetch(`/api/users/${user.id}`);
        const data = await response.json();
        setCredits(data.credits);
      } catch (error) {
        console.error('Failed to fetch credits:', error);
      }
    };

    if (user) {
      fetchCredits();
    }
  }, [user]);

  return (
    <div className="bg-white shadow-sm rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Vos crédits
          </h3>
          <p className="mt-1 text-3xl font-semibold text-indigo-600">
            {credits}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Chaque lead coûte 20 crédits
          </p>
        </div>
        <div className="flex-shrink-0">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Acheter des crédits
          </button>
        </div>
      </div>
    </div>
  )
}
