'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import axios from '@/services/api/request'

interface CreditContextType {
  credit: number
  refreshCredit: () => Promise<void>
}

const CreditContext = createContext<CreditContextType | undefined>(undefined)

export function CreditProvider({ children }: { children: React.ReactNode }) {
  const [credit, setCredit] = useState(0)

  const refreshCredit = useCallback(async () => {
    try {
      const response = await axios.get('/credits/balance')
      setCredit(response.data.balance)
    } catch (error) {
      console.error('Error fetching credit:', error)
    }
  }, [])

  // Initial fetch
  React.useEffect(() => {
    refreshCredit()
  }, [refreshCredit])

  return (
    <CreditContext.Provider value={{ credit, refreshCredit }}>
      {children}
    </CreditContext.Provider>
  )
}

export function useCredit() {
  const context = useContext(CreditContext)
  if (context === undefined) {
    throw new Error('useCredit must be used within a CreditProvider')
  }
  return context
}
