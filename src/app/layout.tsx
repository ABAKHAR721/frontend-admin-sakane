import RootLayoutClient from '@/components/RootLayoutClient'
import './globals.css'

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
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  )
}
