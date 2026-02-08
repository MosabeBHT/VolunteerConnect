import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { comparePassword, generateToken, setAuthCookie } from '@/lib/auth'
import { sendSuccess, sendError } from '@/lib/api-utils'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return sendError('Email and password are required', 400)
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        volunteerProfile: true,
        ngoProfile: true
      }
    })

    if (!user || !user.isActive) {
      return sendError('Invalid credentials', 401)
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
      return sendError('Invalid credentials', 401)
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    const response = sendSuccess('Login successful', { user: userWithoutPassword, token })
    setAuthCookie(response, token)
    return response
  } catch (error: any) {
    console.error('Login error:', error)
    return sendError(error.message || 'Internal server error', 500)
  }
}
