import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  console.log('=== /api/auth/me Start ===')
  
  try {
    const token = request.cookies.get('token')?.value
    console.log('Token from cookies:', {
      present: !!token,
      preview: token ? `${token.slice(0, 10)}...` : 'none'
    })

    if (!token) {
      console.log('No token found')
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded || !decoded.userId) {
      console.log('Invalid token')
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
    }

    console.log('Token decoded:', { userId: decoded.userId })

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        credits: true,
        role: true
      }
    })

    if (!user) {
      console.log('User not found in database')
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 401 })
    }

    console.log('User found:', { id: user.id, email: user.email })
    console.log('=== /api/auth/me End ===')
    
    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error in /api/auth/me:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}
