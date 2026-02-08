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
        volunteerProfile: true,
        ngoProfile: true
      }
    })

    if (!user) {
      return sendError('User not found', 404)
    }

    return sendSuccess('Profile retrieved successfully', user)
  } catch (error: any) {
    console.error('GetProfile error:', error)
    return sendError(error.message || 'Internal server error', 500)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authUser = authenticateRequest(request)
    if (!authUser) {
      return sendError('Access denied. No token provided.', 401)
    }

    const { email } = await request.json()
    const userId = authUser.id

    // Check if email is being changed and if it's already taken
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          NOT: { id: userId }
        }
      })

      if (existingUser) {
        return sendError('Email already in use', 400)
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { email },
      select: {
        id: true,
        email: true,
        role: true
      }
    })

    return sendSuccess('Profile updated successfully', updatedUser)
  } catch (error: any) {
    console.error('UpdateProfile error:', error)
    return sendError(error.message || 'Internal server error', 500)
  }
}
