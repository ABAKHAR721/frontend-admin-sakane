import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Paths that require authentication
const protectedPaths = ['/dashboard', '/profile']
// Paths that should be accessible only to non-authenticated users
const authPaths = ['/login']

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // For protected paths, verify token with /api/auth/me
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }

    try {
      // Verify token validity using our existing auth endpoint
      const response = await fetch(`${request.nextUrl.origin}/api/auth/me`, {
        headers: {
          'Cookie': `token=${token}`,
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('from', pathname)
        return NextResponse.redirect(loginUrl)
      }
    } catch (error) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Prevent authenticated users from accessing auth pages
  if (authPaths.includes(pathname) && token) {
    try {
      const response = await fetch(`${request.nextUrl.origin}/api/auth/me`, {
        headers: {
          'Cookie': `token=${token}`,
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } catch (error) {
      // If token verification fails, allow access to auth pages
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
}
