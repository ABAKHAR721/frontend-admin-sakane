import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    console.log('=== /api/credits/history Start ===')
    
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Récupérer les paramètres de filtrage
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Construire la requête avec les filtres
    const where = {
      userId: user.id,
      ...(type && type !== 'all' ? { type } : {}),
      ...(startDate || endDate
        ? {
            createdAt: {
              ...(startDate ? { gte: new Date(startDate) } : {}),
              ...(endDate ? { lte: new Date(endDate) } : {}),
            },
          }
        : {}),
    }

    // Récupérer les transactions
    const transactions = await prisma.creditTransaction.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    })

    console.log('Found transactions:', {
      count: transactions.length,
      filters: {
        type,
        startDate,
        endDate,
      },
    })

    return NextResponse.json({
      data: transactions,
      currentCredits: user.credits,
    })
  } catch (error) {
    console.error('Error fetching credit history:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}
