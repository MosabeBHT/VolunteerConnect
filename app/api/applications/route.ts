import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { authenticateRequest } from '@/lib/auth'
import { sendSuccess, sendError } from '@/lib/api-utils'

// POST /api/applications - Create application (VOLUNTEER only)
export async function POST(request: NextRequest) {
  try {
    const authUser = authenticateRequest(request)
    if (!authUser) {
      return sendError('Access denied. No token provided.', 401)
    }

    if (authUser.role !== 'VOLUNTEER') {
      return sendError('Access denied. Insufficient permissions.', 403)
    }

    const volunteerId = authUser.id
    const { missionId, message } = await request.json()

    // Check if mission exists
    const mission = await prisma.mission.findUnique({
      where: { id: missionId }
    })

    if (!mission) {
      return sendError('Mission not found', 404)
    }

    if (mission.status !== 'ACTIVE') {
      return sendError('Mission is not active', 400)
    }

    // Check if mission date is in the past
    if (mission.date && new Date(mission.date) < new Date()) {
      return sendError('Cannot apply to missions that have already started', 400)
    }

    // Check if already applied
    const existing = await prisma.application.findUnique({
      where: {
        missionId_volunteerId: {
          missionId,
          volunteerId
        }
      }
    })

    if (existing) {
      return sendError('You have already applied to this mission', 400)
    }

    const application = await prisma.application.create({
      data: {
        missionId,
        volunteerId,
        message
      },
      include: {
        mission: {
          select: {
            title: true,
            date: true,
            location: true
          }
        }
      }
    })

    return sendSuccess('Application submitted successfully', application, 201)
  } catch (error: any) {
    console.error('CreateApplication error:', error)
    return sendError(error.message || 'Internal server error', 500)
  }
}
