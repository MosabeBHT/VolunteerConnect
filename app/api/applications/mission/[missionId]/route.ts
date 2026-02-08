import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { authenticateRequest } from '@/lib/auth'
import { sendSuccess, sendError } from '@/lib/api-utils'

// GET /api/applications/mission/[missionId] - Get mission's applications (NGO only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ missionId: string }> }
) {
  try {
    const authUser = authenticateRequest(request)
    if (!authUser) {
      return sendError('Access denied. No token provided.', 401)
    }

    if (authUser.role !== 'NGO') {
      return sendError('Access denied. Insufficient permissions.', 403)
    }

    const { missionId } = await params
    const ngoId = authUser.id

    // Verify mission belongs to NGO
    const mission = await prisma.mission.findUnique({
      where: { id: missionId }
    })

    if (!mission) {
      return sendError('Mission not found', 404)
    }

    if (mission.creatorId !== ngoId) {
      return sendError('Unauthorized', 403)
    }

    const applications = await prisma.application.findMany({
      where: { missionId },
      include: {
        volunteer: {
          select: {
            id: true,
            email: true,
            volunteerProfile: {
              select: {
                firstName: true,
                lastName: true,
                phone: true,
                location: true,
                bio: true,
                profileImage: true,
                interests: true,
                skills: true,
                experience: true,
                totalHours: true,
                rating: true
              }
            }
          }
        }
      },
      orderBy: { appliedAt: 'desc' }
    })

    return sendSuccess('Applications retrieved successfully', applications)
  } catch (error: any) {
    console.error('GetMissionApplications error:', error)
    return sendError(error.message || 'Internal server error', 500)
  }
}
