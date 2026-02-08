import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth'
import { sendSuccess, sendError } from '@/lib/api-utils'

export async function POST(request: NextRequest) {
  try {
    const { email, password, role, firstName, lastName, location, organizationName, description, registrationNumber } = await request.json()

    // Validate required fields
    if (!email || !password || !role) {
      return sendError('Email, password, and role are required', 400)
    }

    if (!['VOLUNTEER', 'NGO'].includes(role)) {
      return sendError('Role must be VOLUNTEER or NGO', 400)
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return sendError('User with this email already exists', 400)
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user with profile based on role
    let user

    if (role === 'VOLUNTEER') {
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
          volunteerProfile: {
            create: {
              firstName: firstName || 'John',
              lastName: lastName || 'Doe',
              location: location || 'Not specified',
              interests: [],
              skills: []
            }
          }
        },
        include: {
          volunteerProfile: true
        }
      })
    } else if (role === 'NGO') {
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
          ngoProfile: {
            create: {
              organizationName: organizationName || 'Organization',
              email: email,
              location: location || 'Not specified',
              description: description || 'No description provided',
              registrationNumber: registrationNumber || `REG-${Date.now()}`,
              focusAreas: [],
              achievements: []
            }
          }
        },
        include: {
          ngoProfile: true
        }
      })
    } else {
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role
        }
      })
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    })

    const response = sendSuccess('User registered successfully', { user: userWithoutPassword, token }, 201)
    setAuthCookie(response, token)
    return response
  } catch (error: any) {
    console.error('Register error:', error)
    return sendError(error.message || 'Internal server error', 500)
  }
}
