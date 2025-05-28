import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Check if this is production and database is accessible
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'DATABASE_URL not configured' },
        { status: 500 }
      )
    }

    // Test database connection
    await prisma.$connect()
    
    // Check if tables exist by trying to count users
    try {
      const userCount = await prisma.user.count()
      return NextResponse.json({
        success: true,
        message: 'Database is already set up and working!',
        userCount,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      // If tables don't exist, they need to run prisma db push
      return NextResponse.json({
        success: false,
        message: 'Database connected but schema not found. Please run: npx prisma db push',
        error: 'Schema not found',
        timestamp: new Date().toISOString()
      }, { status: 400 })
    }

  } catch (error) {
    console.error('Database setup error:', error)
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
