import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { authenticateRequest } from '@/lib/auth'
import { sendSuccess, sendError } from '@/lib/api-utils'

// GET /api/missions - Get all missions (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || undefined
    const location = searchParams.get('location') || undefined
    const status = searchParams.get('status') || 'ACTIVE'
    const search = searchParams.get('search') || undefined
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const skip = (page - 1) * limit

    const where: any = {
      status,
      ...(category && { category }),
      ...(location && { location: { contains: location, mode: 'insensitive' } }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      })
    }

    const [missions, total] = await Promise.all([
      prisma.mission.findMany({
        where,
        skip,
        take: limit,
        include: {
          creator: {
            select: {
              id: true,
              email: true,
              ngoProfile: {
                select: {
                  organizationName: true,
                  profileImage: true
                }
              }
            }
          },
          _count: {
            select: { applications: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.mission.count({ where })
    ])

    return sendSuccess('Missions retrieved successfully', {
      missions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error: any) {
    console.error('GetAllMissions error:', error)
    return sendError(error.message || 'Internal server error', 500)
  }
}

// POST /api/missions - Create mission (NGO only)
export async function POST(request: NextRequest) {
  try {
    const authUser = authenticateRequest(request)
    if (!authUser) {
      return sendError('Access denied. No token provided.', 401)
    }

    if (authUser.role !== 'NGO') {
      return sendError('Access denied. Insufficient permissions.', 403)
    }

    const creatorId = authUser.id
    const {
      title, description, fullDescription, category, location, address,
      date, startTime, endTime, duration, volunteersNeeded,
      requirements, benefits, whatVolunteersDo, whoCanApply, whatToBring,
      contactInfo, imageUrl, isFeatured, isUrgent, tags, status
    } = await request.json()

    const mission = await prisma.mission.create({
      data: {
        title, description, fullDescription, category, location, address,
        date: new Date(date), startTime, endTime, duration, volunteersNeeded,
        requirements, benefits, whatVolunteersDo, whoCanApply, whatToBring,
        contactInfo, imageUrl, isFeatured, isUrgent, tags,
        status: status || 'ACTIVE',
        creatorId
      },
      include: {
        creator: {
          select: {
            ngoProfile: {
              select: { organizationName: true }
            }
          }
        }
      }
    })

    return sendSuccess('Mission created successfully', mission, 201)
  } catch (error: any) {
    console.error('CreateMission error:', error)
    return sendError(error.message || 'Internal server error', 500)
  }
}
