import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { authenticateRequest } from '@/lib/auth'
import { sendSuccess, sendError } from '@/lib/api-utils'

// GET /api/missions/[id] - Get mission by ID (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const mission = await prisma.mission.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            ngoProfile: {
              select: {
                organizationName: true,
                email: true,
                description: true,
                location: true,
                isVerified: true,
                profileImage: true
              }
            }
          }
        },
        _count: {
          select: { applications: true }
        }
      }
    })

    if (!mission) {
      return sendError('Mission not found', 404)
    }

    return sendSuccess('Mission retrieved successfully', { mission })
  } catch (error: any) {
    console.error('GetMissionById error:', error)
    return sendError(error.message || 'Internal server error', 500)
  }
}

// PUT /api/missions/[id] - Update mission (NGO owner only)
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
    const creatorId = authUser.id
    const {
      title, description, fullDescription, category, location, address,
      date, startTime, endTime, duration, volunteersNeeded,
      requirements, benefits, whatVolunteersDo, whoCanApply, whatToBring,
      contactInfo, imageUrl, isFeatured, isUrgent, tags, status
    } = await request.json()

    // Check if mission exists and belongs to user
    const existing = await prisma.mission.findUnique({
      where: { id }
    })

    if (!existing) {
      return sendError('Mission not found', 404)
    }

    if (existing.creatorId !== creatorId) {
      return sendError('Unauthorized', 403)
    }

    // Build update data only from allowed fields
    const updateData: Record<string, any> = {}
    const allowedFields: Record<string, any> = {
      title, description, fullDescription, category, location, address,
      startTime, endTime, duration, volunteersNeeded,
      requirements, benefits, whatVolunteersDo, whoCanApply, whatToBring,
      contactInfo, imageUrl, isFeatured, isUrgent, tags, status
    }
    for (const [key, value] of Object.entries(allowedFields)) {
      if (value !== undefined) updateData[key] = value
    }
    if (date) updateData.date = new Date(date)

    const mission = await prisma.mission.update({
      where: { id },
      data: updateData
    })

    return sendSuccess('Mission updated successfully', mission)
  } catch (error: any) {
    console.error('UpdateMission error:', error)
    return sendError(error.message || 'Internal server error', 500)
  }
}

// DELETE /api/missions/[id] - Delete mission (NGO owner only)
export async function DELETE(
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
    const creatorId = authUser.id

    // Check if mission exists and belongs to user
    const existing = await prisma.mission.findUnique({
      where: { id }
    })

    if (!existing) {
      return sendError('Mission not found', 404)
    }

    if (existing.creatorId !== creatorId) {
      return sendError('Unauthorized', 403)
    }

    await prisma.mission.delete({
      where: { id }
    })

    return sendSuccess('Mission deleted successfully')
  } catch (error: any) {
    console.error('DeleteMission error:', error)
    return sendError(error.message || 'Internal server error', 500)
  }
}
