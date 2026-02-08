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

    if (authUser.role !== 'NGO') {
      return sendError('Access denied. Insufficient permissions.', 403)
    }

    const userId = authUser.id
    const body = await request.json()

    // Whitelist allowed fields
    const { organizationName, email, phone, website, location, address,
            description, mission, vision, foundedYear, teamSize,
            volunteersServed, focusAreas, achievements, profileImage,
            bannerImage, socialMedia } = body
    const data: Record<string, any> = {}
    const allowed: Record<string, any> = { organizationName, email, phone, website, location, address,
                      description, mission, vision, foundedYear, teamSize,
                      volunteersServed, focusAreas, achievements, profileImage,
                      bannerImage, socialMedia }
    for (const [key, value] of Object.entries(allowed)) {
      if (value !== undefined) data[key] = value
    }

    // Check if profile exists
    const existing = await prisma.nGOProfile.findUnique({
      where: { userId }
    })

    let profile
    if (existing) {
      profile = await prisma.nGOProfile.update({
        where: { userId },
        data
      })
    } else {
      profile = await prisma.nGOProfile.create({
        data: {
          ...data,
          userId
        }
      })
    }

    return sendSuccess('NGO profile updated successfully', profile)
  } catch (error: any) {
    console.error('UpdateNGOProfile error:', error)
    return sendError(error.message || 'Internal server error', 500)
  }
}
