import { NextResponse } from 'next/server'
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

    // Communiquer avec le backend pour l'authentification
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await backendResponse.json();

    // Si la réponse n'est pas ok, retourner l'erreur du backend
    if (!backendResponse.ok) {
      console.log('Authentication failed:', data.error);
      return NextResponse.json(
        { error: data.error || 'Email ou mot de passe incorrect' },
        { status: backendResponse.status }
      );
    }

    // Create token from backend response
    const token = data.token || data.access_token;

    if (!token) {
      console.error('No token received from backend');
      return NextResponse.json(
        { error: 'Authentication error' },
        { status: 500 }
      );
    }

    // Create response with user data and token
    const response = NextResponse.json({
      success: true,
      user: data.user,
      token: token
    });

    // Set cookie with strict options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    }

    // Définir le cookie avec le token reçu du backend
    response.cookies.set('token', data.token, cookieOptions)

    console.log('Login successful for user:', {
      userId: data.user.id,
      cookieOptions
    })

    return response;

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la connexion' },
      { status: 500 }
    )
  }
}