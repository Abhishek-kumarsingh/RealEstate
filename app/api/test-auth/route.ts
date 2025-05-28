import { NextRequest, NextResponse } from 'next/server'
import { signToken } from '@/lib/jwt'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (email === 'admin@realestatehub.com') {
      // Generate a test token for the admin user
      const token = signToken({
        userId: 'cmb886kor0003b8o4ai8i47i5',
        email: 'admin@realestatehub.com',
        role: 'ADMIN'
      })
      
      return NextResponse.json({
        success: true,
        token,
        user: {
          id: 'cmb886kor0003b8o4ai8i47i5',
          email: 'admin@realestatehub.com',
          name: 'Admin User',
          role: 'ADMIN'
        }
      })
    }
    
    return NextResponse.json({
      success: false,
      error: 'User not found'
    }, { status: 404 })
    
  } catch (error) {
    console.error('Test auth error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Test auth endpoint - use POST with email'
  })
}
