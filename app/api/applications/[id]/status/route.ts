import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { authenticateRequest } from '@/lib/auth'
import { sendSuccess, sendError } from '@/lib/api-utils'

// PUT /api/applications/[id]/status - Update application status (NGO only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = authenticateRequest(request)
    if (!authUser) {
      return sendError('Access denied. No token provided.', 401)
    }

    if (authUser.role !== 'NGO') {
      return sendError('Access denied. Insufficient permissions.', 403)
    }

    const { id } = await params
    const { status, feedback } = await request.json()
    const ngoId = authUser.id

    // Validate status value
    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
      return sendError('Invalid status. Must be ACCEPTED or REJECTED', 400)
    }

    // Get application with mission
    const application = await prisma.application.findUnique({
      where: { id },
      include: { mission: true }
    })

    if (!application) {
      return sendError('Application not found', 404)
    }

    if (application.mission.creatorId !== ngoId) {
      return sendError('Unauthorized', 403)
    }

    // Prevent invalid state transitions
    if (application.status !== 'PENDING') {
      return sendError('Can only accept or reject pending applications', 400)
    }

    // Overflow guard: prevent accepting beyond capacity
    if (status === 'ACCEPTED') {
      if (application.mission.volunteersAccepted >= application.mission.volunteersNeeded) {
        return sendError('Mission is already at full capacity', 400)
      }
    }

    // Use transaction to ensure both operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      // Update application status
      const updated = await tx.application.update({
        where: { id },
        data: {
          status,
          feedback,
          reviewedAt: new Date()
        },
        include: {
          volunteer: {
            select: {
              email: true,
              volunteerProfile: {
                select: { firstName: true, lastName: true }
              }
            }
          },
          mission: {
            select: { title: true }
          }
        }
      })

      // Update mission volunteer count if accepted
      if (status === 'ACCEPTED') {
        await tx.mission.update({
          where: { id: application.missionId },
          data: {
            volunteersAccepted: {
              increment: 1
            }
          }
        })
      }

      return updated
    })

    return sendSuccess('Application status updated successfully', result)
  } catch (error: any) {
    console.error('UpdateApplicationStatus error:', error)
    return sendError(error.message || 'Internal server error', 500)
  }
}
