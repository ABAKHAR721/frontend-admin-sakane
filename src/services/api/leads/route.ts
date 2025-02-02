import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    console.log('=== /api/leads Start ===')
    
    const user = await getCurrentUser(request)
    console.log('Current user:', user)
    
    if (!user) {
      console.log('No user found')
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Récupérer tous les leads disponibles (non achetés par l'utilisateur)
    console.log('Fetching available leads for user:', user.id)
    
    const propertyRequests = await prisma.propertyRequest.findMany({
      where: {
        NOT: {
          purchases: {
            some: {
              userId: user.id
            }
          }
        }
      },
      include: {
        purchases: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Formater les données pour l'affichage
    const leads = propertyRequests.map(request => ({
      id: request.id,
      createdAt: request.createdAt,
      status: request.status,
      mode: request.mode,
      type: request.type,
      bedrooms: request.bedrooms,
      area: request.area,
      budget: request.budget,
      rentalDuration: request.rentalDuration,
      timing: request.timing,
      address: request.address,
      // Ne pas inclure les informations de contact
      // contactName: request.contactName,
      // contactEmail: request.contactEmail,
      // contactPhone: request.contactPhone,
      purchaseCount: request.purchases.length,
      isAvailable: request.purchases.length === 0
    }))

    console.log('Found available leads:', {
      count: leads.length,
      sample: leads.slice(0, 2).map(lead => ({
        id: lead.id,
        mode: lead.mode,
        type: lead.type,
        purchaseCount: lead.purchaseCount,
        isAvailable: lead.isAvailable
      }))
    })

    console.log('=== /api/leads End ===')
    return NextResponse.json({ data: leads })
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json({ data: [] })
  }
}
