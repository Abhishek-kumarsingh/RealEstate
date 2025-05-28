import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('Debug endpoint called')
    
    // Check environment variables
    const envCheck = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      JWT_SECRET: !!process.env.JWT_SECRET,
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    }
    
    console.log('Environment variables:', envCheck)
    
    // Check if Prisma client is available
    if (!prisma) {
      return NextResponse.json({
        success: false,
        error: 'Prisma client not available',
        envCheck,
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }
    
    // Test database connection
    console.log('Testing database connection...')
    await prisma.$connect()
    console.log('Database connected successfully')
    
    // Test user count
    const userCount = await prisma.user.count()
    console.log('User count:', userCount)
    
    // Test specific admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@realestatehub.com' },
      select: { id: true, email: true, name: true, role: true }
    })
    console.log('Admin user found:', !!adminUser)
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        userCount,
        adminUserExists: !!adminUser,
        adminUser: adminUser ? { 
          id: adminUser.id, 
          email: adminUser.email, 
          name: adminUser.name, 
          role: adminUser.role 
        } : null
      },
      envCheck,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Debug endpoint error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  } finally {
    try {
      await prisma.$disconnect()
    } catch (e) {
      console.error('Error disconnecting:', e)
    }
  }
}
