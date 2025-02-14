'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import axios from '@/services/api/request'

interface CreditContextType {
  credit: number
  refreshCredit: () => Promise<void>
}

const CreditContext = createContext<CreditContextType | undefined>(undefined)

export function CreditProvider({ children }: { children: React.ReactNode }) {
  const [credit, setCredit] = useState(0)

  const refreshCredit = useCallback(async () => {
    // Check if we have a token before making the request
    const token = localStorage.getItem('token') || document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1]
    if (!token) {
      setCredit(0)
      return
    }

    try {
      const response = await axios.get('/credits/balance')
      if (response.data?.balance !== undefined) {
        setCredit(response.data.balance)
      }
    } catch (error: any) {
      // If unauthorized or token expired, clear credit
      if (error?.response?.status === 401) {
        setCredit(0)
        return
      }
      console.error('Error fetching credit:', error)
    }
  }, [])

  // Initial fetch - only if we're on a client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      refreshCredit()
    }
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
