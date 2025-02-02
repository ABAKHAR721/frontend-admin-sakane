import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    console.log('=== /api/my-leads Start ===')
    
    const user = await getCurrentUser(request)
    console.log('Current user:', user)
    
    if (!user) {
      console.log('No user found')
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    console.log('Fetching purchased leads for user:', user.id)
    
    // Récupérer tous les leads achetés par l'utilisateur
    const purchasedLeads = await prisma.propertyRequest.findMany({
      where: {
        purchases: {
          some: {
            userId: user.id
          }
        }
      },
      include: {
        purchases: {
          where: {
            userId: user.id
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Formater les données pour l'affichage avec les informations de contact
    const leads = purchasedLeads.map(request => ({
      id: request.id,
      purchaseId: request.purchases[0]?.id,
      purchasedAt: request.purchases[0]?.purchasedAt,
      creditsPaid: request.purchases[0]?.creditsPaid,
      // Informations de la propriété
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
      // Informations de contact (disponibles car achetées)
      contactName: request.contactName,
      contactEmail: request.contactEmail,
      contactPhone: request.contactPhone
    }))

    console.log('Found purchased leads:', {
      count: leads.length,
      sample: leads.slice(0, 2).map(lead => ({
        id: lead.id,
        purchaseId: lead.purchaseId,
        mode: lead.mode,
        type: lead.type,
        hasContactInfo: !!lead.contactPhone
      }))
    })

    console.log('=== /api/my-leads End ===')
    return NextResponse.json({ data: leads })
  } catch (error) {
    console.error('Error fetching my leads:', error)
    return NextResponse.json({ data: [] })
  }
}
