import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string
    email: string
    role: string
    isVerified: boolean
  }
}

export async function requireAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    // Get token from Authorization header or cookie
    let token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      token = request.cookies.get('auth-token')?.value
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify JWT token
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any

    // Check if session exists and is valid
    const session = await prisma.userSession.findUnique({
      where: {
        token,
        expiresAt: { gt: new Date() }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isVerified: true,
            isActive: true,
          }
        }
      }
    })

    if (!session || !session.user.isActive) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      )
    }

    // Add user info to request
    const authenticatedRequest = request as AuthenticatedRequest
    authenticatedRequest.user = {
      userId: session.user.id,
      email: session.user.email,
      role: session.user.role,
      isVerified: session.user.isVerified,
    }

    return await handler(authenticatedRequest)

  } catch (error: any) {
    console.error('Authentication error:', error)

    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    if (error.name === 'TokenExpiredError') {
      return NextResponse.json(
        { error: 'Token expired' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    )
  }
}

export async function requireRole(
  roles: string[],
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  return requireAuth(request, async (req: AuthenticatedRequest) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    return await handler(req)
  })
}

export async function requireAgent(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  return requireRole(['AGENT', 'ADMIN', 'SUPER_ADMIN'], request, handler)
}

export async function requireAdmin(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  return requireRole(['ADMIN', 'SUPER_ADMIN'], request, handler)
}

// Utility function to get current user from request
export async function getCurrentUser(request: NextRequest) {
  try {
    let token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      token = request.cookies.get('auth-token')?.value
    }

    if (!token) {
      return null
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any

    const session = await prisma.userSession.findUnique({
      where: {
        token,
        expiresAt: { gt: new Date() }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatar: true,
            isVerified: true,
            isActive: true,
            verificationStatus: true,
          }
        }
      }
    })

    return session?.user || null

  } catch (error) {
    return null
  }
}

// Utility function to logout user (invalidate session)
export async function logoutUser(token: string) {
  try {
    await prisma.userSession.delete({
      where: { token }
    })
    return true
  } catch (error) {
    console.error('Logout error:', error)
    return false
  }
}
