import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { authenticateRequest } from '@/lib/auth'
import { sendSuccess, sendError } from '@/lib/api-utils'

export async function GET(request: NextRequest) {
  try {
    const authUser = authenticateRequest(request)
    if (!authUser) {
      return sendError('Access denied. No token provided.', 401)
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        id: true,
        email: true,
        role: true,
        isVerified: true,
        isActive: true,
        createdAt: true,
        volunteerProfile: true,
        ngoProfile: true
      }
    })

    if (!user) {
      return sendError('User not found', 404)
    }

    return sendSuccess('User retrieved successfully', user)
  } catch (error: any) {
    console.error('GetMe error:', error)
    return sendError(error.message || 'Internal server error', 500)
  }
}
