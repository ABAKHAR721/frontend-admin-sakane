import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Déconnexion réussie'
  })
  
  // Supprimer le cookie
  response.cookies.delete('token')

  return response
}
