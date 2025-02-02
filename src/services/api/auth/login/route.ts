import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyPassword, generateToken } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    console.log('Login attempt for:', email)

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log('User not found:', email)
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    // Vérifier le mot de passe
    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      console.log('Invalid password for user:', email)
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    try {
      // Générer le token
      const token = await generateToken(user.id)
      console.log('Generated token for user:', {
        userId: user.id,
        tokenPreview: token.slice(0, 10) + '...'
      })
      
      // Créer la réponse avec les headers CORS
      const response = NextResponse.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          credits: user.credits,
          role: user.role,
        }
      })

      // Définir le cookie avec des options plus strictes
      const cookieOptions = {
        httpOnly: true,
        secure: false, // Mettre à true en production
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 7 * 24 * 60 * 60 // 7 jours
      }

      // Définir le cookie
      response.cookies.set('token', token, cookieOptions)

      console.log('Login successful for user:', {
        userId: user.id,
        cookieOptions
      })

      return response
    } catch (tokenError) {
      console.error('Token generation error:', tokenError)
      return NextResponse.json(
        { error: 'Erreur lors de la génération du token' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la connexion' },
      { status: 500 }
    )
  }
}
