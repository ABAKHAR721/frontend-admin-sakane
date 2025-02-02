import { AuthProvider } from '@/hooks/useAuth'
import { CreditProvider } from '@/contexts/CreditContext'
import Navigation from '@/components/Navigation'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'Sakane Ask Dashboard',
  description: 'Dashboard for Sakane Ask',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-gray-50">
        <AuthProvider>
          <CreditProvider>
            <div className="min-h-screen">
              <Navigation />
              <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {children}
                </div>
              </div>
            </div>
            <Toaster position="top-right" />
          </CreditProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
