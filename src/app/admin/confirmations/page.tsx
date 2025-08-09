'use client'

import AdminPendingTransactions from '@/components/AdminPendingTransactions'

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto">
        <AdminPendingTransactions />
      </div>
    </div>
  )
}