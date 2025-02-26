import './globals.css'
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/hooks/useAuth';
import Sidebar from '@/components/Sidebar';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} antialiased h-full`}> 
        <AuthProvider>
          <div className="flex">
            <Sidebar />
            <main className="flex-1">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
