import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader, JWTPayload } from '@/lib/jwt';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

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
    
    // Connect to database and get user details
    await connectDB();
    const user = await User.findById(payload.userId).select('-password');
    
    if (!user) {
      return { user: null, error: 'User not found' };
    }
    
    return { 
      user: {
        userId: user._id.toString(),
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
