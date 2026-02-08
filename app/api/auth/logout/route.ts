import { NextRequest } from 'next/server'
import { removeAuthCookie } from '@/lib/auth'
import { sendSuccess } from '@/lib/api-utils'

export async function POST(request: NextRequest) {
  const response = sendSuccess('Logout successful')
  removeAuthCookie(response)
  return response
}
