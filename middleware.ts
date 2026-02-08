import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Middleware runs server-side and cannot access localStorage
  // Auth protection is handled by client-side AuthGuard component
  // This middleware is kept minimal for potential future server-side checks
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}
