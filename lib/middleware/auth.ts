import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader, JWTPayload } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
    name: string;
  };
}

export async function authenticateToken(request: NextRequest): Promise<{ user: any; error?: string }> {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader || '');

    const payload: JWTPayload = verifyToken(token);

    // Get user details from database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        phone: true
      }
    });

    if (!user) {
      return { user: null, error: 'User not found' };
    }

    return {
      user: {
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

export function requireAuth(handler: Function) {
  return async (request: NextRequest, context: any) => {
    const { user, error } = await authenticateToken(request);

    if (error || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Add user to request object
    (request as AuthenticatedRequest).user = user;

    return handler(request, context);
  };
}

export function requireRole(roles: string[]) {
  return function(handler: Function) {
    return async (request: NextRequest, context: any) => {
      const { user, error } = await authenticateToken(request);

      if (error || !user) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      if (!roles.includes(user.role)) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      // Add user to request object
      (request as AuthenticatedRequest).user = user;

      return handler(request, context);
    };
  };
}
