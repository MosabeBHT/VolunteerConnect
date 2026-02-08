import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { authenticateRequest } from '@/lib/auth'
import { sendSuccess, sendError } from '@/lib/api-utils'

// GET /api/missions/my/missions - Get NGO's own missions
export async function GET(request: NextRequest) {
  try {
    const authUser = authenticateRequest(request)
    if (!authUser) {
      return sendError('Access denied. No token provided.', 401)
    }

    if (authUser.role !== 'NGO') {
      return sendError('Access denied. Insufficient permissions.', 403)
    }

    const creatorId = authUser.id
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || undefined

    const where: any = {
      creatorId,
      ...(status && { status })
    }

    const missions = await prisma.mission.findMany({
      where,
      include: {
        creator: {
          select: {
            ngoProfile: {
              select: {
                organizationName: true,
                isVerified: true
              }
            }
          }
        },
        _count: {
          select: {
            applications: true
          }
        },
        applications: {
          where: { status: 'PENDING' },
          select: { id: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return sendSuccess('Missions retrieved successfully', missions)
  } catch (error: any) {
    console.error('GetMyMissions error:', error)
    return sendError(error.message || 'Internal server error', 500)
  }
}
