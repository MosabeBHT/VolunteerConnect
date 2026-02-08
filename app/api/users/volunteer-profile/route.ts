import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { authenticateRequest } from '@/lib/auth'
import { sendSuccess, sendError } from '@/lib/api-utils'

export async function PUT(request: NextRequest) {
  try {
    const authUser = authenticateRequest(request)
    if (!authUser) {
      return sendError('Access denied. No token provided.', 401)
    }

    if (authUser.role !== 'VOLUNTEER') {
      return sendError('Access denied. Insufficient permissions.', 403)
    }

    const userId = authUser.id
    const body = await request.json()

    // Whitelist allowed fields
    const { firstName, lastName, phone, location, bio, profileImage, bannerImage,
            availability, experience, interests, skills } = body
    const data: Record<string, any> = {}
    const allowed: Record<string, any> = { firstName, lastName, phone, location, bio, profileImage, bannerImage,
                      availability, experience, interests, skills }
    for (const [key, value] of Object.entries(allowed)) {
      if (value !== undefined) data[key] = value
    }

    // Check if profile exists
    const existing = await prisma.volunteerProfile.findUnique({
      where: { userId }
    })

    let profile
    if (existing) {
      profile = await prisma.volunteerProfile.update({
        where: { userId },
        data
      })
    } else {
      profile = await prisma.volunteerProfile.create({
        data: {
          ...data,
          userId
        }
      })
    }

    return sendSuccess('Volunteer profile updated successfully', profile)
  } catch (error: any) {
    console.error('UpdateVolunteerProfile error:', error)
    return sendError(error.message || 'Internal server error', 500)
  }
}
