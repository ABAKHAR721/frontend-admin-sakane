'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Cookies from 'js-cookie';
import { HomeIcon, DocumentTextIcon, DocumentDuplicateIcon, CreditCardIcon, UserIcon } from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Leads', href: '/leads', icon: DocumentTextIcon },
  { name: 'Mes Leads', href: '/my-leads', icon: DocumentDuplicateIcon },
  { name: 'Crédits', href: '/credits', icon: CreditCardIcon },
  { name: 'Mon Compte', href: '/account', icon: UserIcon },
]

export default function Sidebar() {
  const pathname = usePathname()

  const handleLogout = async () => {
    console.log("Logout initiated"); // Debugging log
    try {
      const response = await fetch('/api/logout', { method: 'POST' }); // Call the backend API to log out
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      Cookies.remove('token'); // Remove the cookie
      // Redirect to login page or handle post-logout logic
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      {pathname !== '/login' && (
        <div className="flex h-screen flex-col justify-between border-r bg-white">
          <div className="px-4 py-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              <img src="/logo.png" alt="Logo" className="h-8 w-8" />
              <span className="text-xl font-bold">Sakane Ask</span>
            </Link>

            <nav className="mt-6 flex flex-1 flex-col">
              <ul role="list" className="space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`group flex items-center gap-2.5 rounded-lg px-4 py-2 text-sm font-medium ${
                          isActive
                            ? 'bg-gray-100 text-blue-700'
                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                        }`}
                      >
                        <item.icon className={`h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>

          <div className="sticky inset-x-0 bottom-0 border-t border-gray-100 bg-white p-4">
            <div className="flex items-center gap-4">
              <img
                alt="User"
                src="https://avatars.githubusercontent.com/u/1?v=4"
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium text-gray-700">Nom Utilisateur</p>
                <p className="text-xs text-gray-500">email@example.com</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 w-full rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Déconnexion
            </button>
          </div>
        </div>
      )}
    </>
  )
}
