'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useEffect } from 'react';

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth() // Include isLoading from useAuth
  
  const links = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Leads', path: '/admin/leads' },
    { name: 'Users', path: '/admin/users' },
    { name: 'Statistics', path: '/admin/stats' },
    { name: 'Transactions', path: '/admin/transactions' },
    { name: 'Confirmations', path: '/admin/confirmations' },
    { name: 'Logs', path: '/admin/logs' },
  ]

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }


  useEffect(() => {
      if (user && user.role !== 'admin') {
        router.push('/user'); // Or any other appropriate route
      }
    }, [user, router]);


  if (!user) {
    return <div>Please login.</div>; // Or redirect to login page if not logged in
  }


  return (
    <div className="w-64 bg-white shadow-lg h-screen p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <nav className="flex flex-col space-y-4">
          {links.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                pathname === link.path
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Bouton Déconnexion (visible uniquement si user connecté) */}

        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-100"
          >
            Logout
          </button>
        </div>

    </div>
  );
}