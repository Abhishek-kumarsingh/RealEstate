import jwt from 'jsonwebtoken';

// Get JWT secret with fallback for build time
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-build-only';

// Only throw error at runtime, not during build
function validateJWTSecret() {
  if (!process.env.JWT_SECRET) {
    // During build time, just warn
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      console.warn('JWT_SECRET not found during build - this is expected');
      return;
    }
    // At runtime, throw error
    throw new Error('Please define the JWT_SECRET environment variable');
  }
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export function signToken(payload: JWTPayload): string {
  validateJWTSecret();
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // Token expires in 7 days
  });
}

export function verifyToken(token: string): JWTPayload {
  validateJWTSecret();
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export function extractTokenFromHeader(authHeader: string | undefined): string {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }
  return authHeader.substring(7);
}
