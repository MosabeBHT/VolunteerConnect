import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { authenticateRequest } from '@/lib/auth'
import { sendSuccess, sendError } from '@/lib/api-utils'

// GET /api/applications/my - Get volunteer's applications
export async function GET(request: NextRequest) {
  try {
    const authUser = authenticateRequest(request)
    if (!authUser) {
      return sendError('Access denied. No token provided.', 401)
    }

    if (authUser.role !== 'VOLUNTEER') {
      return sendError('Access denied. Insufficient permissions.', 403)
    }

    const volunteerId = authUser.id
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || undefined

    const where: any = {
      volunteerId,
      ...(status && { status })
    }

    const applications = await prisma.application.findMany({
      where,
      include: {
        mission: {
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
            location: true,
            date: true,
            duration: true,
            creator: {
              select: {
                ngoProfile: {
                  select: {
                    organizationName: true,
                    profileImage: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { appliedAt: 'desc' }
    })

    return sendSuccess('Applications retrieved successfully', applications)
  } catch (error: any) {
    console.error('GetMyApplications error:', error)
    return sendError(error.message || 'Internal server error', 500)
  }
}
