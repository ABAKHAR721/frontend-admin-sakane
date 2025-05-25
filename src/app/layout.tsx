// src/app/layout.tsx

import './globals.css';
import RootLayoutClient from '@/components/RootLayoutClient';

export const metadata = {
  title: 'Admin Dashboard Sakane Ask',
  description: 'Admin Dashboard for Sakane Ask',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-gray-50">
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}
