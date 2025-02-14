import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Paths that require authentication
const protectedPaths = ['/dashboard', '/profile', '/myleads', '/leads']
// Paths that should be accessible only to non-authenticated users
const authPaths = ['/login', '/register']

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl
  const lowercasePath = pathname.toLowerCase()

  // For protected paths, verify token
  if (protectedPaths.some(path => lowercasePath.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // User has token, allow access
    return NextResponse.next()
  }

  // For auth paths, redirect to dashboard if already authenticated
  if (authPaths.some(path => lowercasePath.startsWith(path)) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/ (API routes)
     * 2. /_next/ (Next.js internals)
     * 3. /_static (inside /public)
     * 4. /_vercel (Vercel internals)
     * 5. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
}
