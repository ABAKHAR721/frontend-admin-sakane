import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

const LEAD_COST = 20 // Coût en crédits pour acheter un lead

export async function POST(request: NextRequest) {
  try {
    console.log('=== /api/leads/purchase Start ===')
    
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Récupérer l'ID du lead à acheter
    const { leadId } = await request.json()
    if (!leadId) {
      return NextResponse.json(
        { error: 'ID du lead manquant' },
        { status: 400 }
      )
    }

    console.log('Purchase request:', {
      userId: user.id,
      leadId,
      userCredits: user.credits
    })

    // Vérifier si l'utilisateur a déjà acheté ce lead
    const existingPurchase = await prisma.purchasedLead.findUnique({
      where: {
        userId_propertyRequestId: {
          userId: user.id,
          propertyRequestId: leadId
        }
      }
    })

    if (existingPurchase) {
      return NextResponse.json(
        { error: 'Vous avez déjà acheté ce lead' },
        { status: 400 }
      )
    }

    // Vérifier si l'utilisateur a assez de crédits
    if (user.credits < LEAD_COST) {
      return NextResponse.json(
        { error: 'Crédits insuffisants' },
        { status: 400 }
      )
    }

    // Créer la transaction d'achat et mettre à jour les crédits
    const [purchase, updatedUser] = await prisma.$transaction([
      // Créer l'achat
      prisma.purchasedLead.create({
        data: {
          userId: user.id,
          propertyRequestId: leadId,
          creditsPaid: LEAD_COST
        },
        include: {
          propertyRequest: true
        }
      }),
      // Mettre à jour les crédits de l'utilisateur
      prisma.user.update({
        where: { id: user.id },
        data: {
          credits: {
            decrement: LEAD_COST
          }
        }
      })
    ])

    console.log('Purchase successful:', {
      purchaseId: purchase.id,
      leadId: purchase.propertyRequestId,
      remainingCredits: updatedUser.credits
    })

    return NextResponse.json({
      success: true,
      purchase: {
        id: purchase.id,
        purchasedAt: purchase.purchasedAt,
        creditsPaid: purchase.creditsPaid,
        lead: {
          id: purchase.propertyRequest.id,
          contactName: purchase.propertyRequest.contactName,
          contactEmail: purchase.propertyRequest.contactEmail,
          contactPhone: purchase.propertyRequest.contactPhone
        }
      },
      remainingCredits: updatedUser.credits
    })
  } catch (error) {
    console.error('Error purchasing lead:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'achat' },
      { status: 500 }
    )
  }
}
