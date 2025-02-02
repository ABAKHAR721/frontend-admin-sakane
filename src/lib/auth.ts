import { compare, hash } from 'bcryptjs'
import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import prisma from './db'
import * as jose from 'jose'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
)

const alg = 'HS256'

export async function hashPassword(password: string) {
  return hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return compare(password, hashedPassword)
}

export async function generateToken(userId: number): Promise<string> {
  try {
    const jwt = await new jose.SignJWT({ userId })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret)

    console.log('Auth - Generated token:', {
      userId,
      tokenLength: jwt.length,
      secret: process.env.JWT_SECRET?.slice(0, 3) + '...'
    })

    return jwt
  } catch (error) {
    console.error('Auth - Error generating token:', error)
    throw error
  }
}

export async function verifyToken(token: string) {
  try {
    console.log('Auth - Verifying token:', {
      tokenLength: token.length,
      secret: process.env.JWT_SECRET?.slice(0, 3) + '...'
    })
    
    const { payload } = await jose.jwtVerify(token, secret, {
      algorithms: [alg]
    })
    
    if (!payload || typeof payload.userId !== 'number') {
      console.log('Auth - Invalid payload structure')
      return null
    }
    
    console.log('Auth - Token verified successfully:', {
      userId: payload.userId,
      exp: payload.exp ? new Date(payload.exp * 1000).toISOString() : 'unknown'
    })
    
    return { userId: payload.userId }
  } catch (error) {
    console.error('Auth - Token verification failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      token: token.slice(0, 10) + '...',
      secret: process.env.JWT_SECRET?.slice(0, 3) + '...'
    })
    return null
  }
}

export async function getTokenFromCookies(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  console.log('Auth - Token from cookies:', {
    present: !!token,
    tokenPreview: token ? token.slice(0, 10) + '...' : 'none'
  })
  return token
}

export async function getCurrentUser(request: NextRequest) {
  console.log('Auth - Getting current user from request')
  
  const token = await getTokenFromCookies(request)
  if (!token) {
    console.log('Auth - No token found')
    return null
  }

  const decoded = await verifyToken(token)
  if (!decoded) {
    console.log('Auth - Token verification failed')
    return null
  }

  try {
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

    console.log('Auth - User lookup result:', {
      found: !!user,
      userId: decoded.userId
    })

    return user
  } catch (error) {
    console.error('Auth - Database error:', error instanceof Error ? error.message : 'Unknown error')
    return null
  }
}
