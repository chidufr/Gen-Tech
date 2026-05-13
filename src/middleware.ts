import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Security: Only allow iframe embedding from same origin (prevents clickjacking)
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('Content-Security-Policy', "frame-ancestors 'self'")
  
  // Additional security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  return response
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}