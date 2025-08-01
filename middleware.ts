import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authToken = request.cookies.get('auth-token')?.value
  const userRole = request.cookies.get('user-role')?.value // 'associate' or 'pm'

  const publicRoutes = ['/login', '/unauthorized']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  const apiRoutes = ['/api/']
  const isApiRoute = apiRoutes.some(route => pathname.startsWith(route))

  const pmRoutes = ['/pm-dashboard']
  const isPMRoute = pmRoutes.some(route => pathname.startsWith(route))

  const associateRoutes = ['/dashboard', '/projects', '/about', '/analytics', '/profile', '/settings', '/admin']
  const isAssociateRoute = associateRoutes.some(route => pathname.startsWith(route))

  // Allow access to public routes
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Check if user is authenticated
  if (!authToken) {
    const loginUrl = new URL('/login', request.url)
    if (!isPublicRoute) {
      loginUrl.searchParams.set('redirect', pathname)
    }
    return NextResponse.redirect(loginUrl)
  }

  // Allow API routes for authenticated users
  if (isApiRoute) {
    return NextResponse.next()
  }

  // Check role-based access for authenticated users
  if (isPMRoute) {
    if (userRole !== 'pm') {
      console.log('PM route access denied - user role:', userRole)
      const unauthorizedUrl = new URL('/unauthorized', request.url)
      unauthorizedUrl.searchParams.set('route', pathname)
      return NextResponse.redirect(unauthorizedUrl)
    }
  }

  if (isAssociateRoute) {
    if (userRole !== 'associate') {
      console.log('Associate route access denied - user role:', userRole)
      const unauthorizedUrl = new URL('/unauthorized', request.url)
      unauthorizedUrl.searchParams.set('route', pathname)
      return NextResponse.redirect(unauthorizedUrl)
    }
  }

  // Handle root path redirect based on user role
  if (pathname === '/') {
    if (userRole === 'pm') {
      return NextResponse.redirect(new URL('/pm-dashboard', request.url))
    } else if (userRole === 'associate') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } else {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Add security headers
  const response = NextResponse.next()
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 