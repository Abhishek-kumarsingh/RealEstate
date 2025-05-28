import { NextRequest } from 'next/server';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
    name: string;
  };
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
  iat?: number;
  exp?: number;
}

export interface AuthUser {
  userId: string;
  email: string;
  role: string;
  name: string;
  avatar?: string;
  phone?: string;
}

export interface AuthResponse {
  user: AuthUser | null;
  error?: string;
}
