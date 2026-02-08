import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { authenticateRequest } from '@/lib/auth'
import { sendSuccess, sendError } from '@/lib/api-utils'

// PUT /api/applications/[id]/withdraw - Withdraw application (VOLUNTEER only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = authenticateRequest(request)
    if (!authUser) {
      return sendError('Access denied. No token provided.', 401)
    }

    if (authUser.role !== 'VOLUNTEER') {
      return sendError('Access denied. Insufficient permissions.', 403)
    }

    const { id } = await params
    const volunteerId = authUser.id

    const application = await prisma.application.findUnique({
      where: { id }
    })

    if (!application) {
      return sendError('Application not found', 404)
    }

    if (application.volunteerId !== volunteerId) {
      return sendError('Unauthorized', 403)
    }

    if (!['PENDING', 'ACCEPTED'].includes(application.status)) {
      return sendError('Can only withdraw pending or accepted applications', 400)
    }

    // If withdrawing an accepted application, decrement the volunteers count
    if (application.status === 'ACCEPTED') {
      await prisma.mission.update({
        where: { id: application.missionId },
        data: { volunteersAccepted: { decrement: 1 } }
      })
    }

    const updated = await prisma.application.update({
      where: { id },
      data: { status: 'WITHDRAWN' }
    })

    return sendSuccess('Application withdrawn successfully', updated)
  } catch (error: any) {
    console.error('WithdrawApplication error:', error)
    return sendError(error.message || 'Internal server error', 500)
  }
}
