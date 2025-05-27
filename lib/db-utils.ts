import { prisma } from './prisma'
import { Prisma } from '@prisma/client'

// Database connection utility
export async function connectDB() {
  try {
    await prisma.$connect()
    console.log('✅ Connected to PostgreSQL database')
    return true
  } catch (error) {
    console.error('❌ Failed to connect to database:', error)
    throw error
  }
}

// Database disconnection utility
export async function disconnectDB() {
  try {
    await prisma.$disconnect()
    console.log('✅ Disconnected from database')
  } catch (error) {
    console.error('❌ Error disconnecting from database:', error)
  }
}

// Health check utility
export async function checkDatabaseHealth() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return { status: 'healthy', timestamp: new Date() }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    }
  }
}

// Transaction wrapper utility
export async function withTransaction<T>(
  callback: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  return await prisma.$transaction(callback)
}

// Pagination utility
export interface PaginationOptions {
  page?: number
  limit?: number
  orderBy?: any
}

export interface PaginationResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export async function paginate<T>(
  model: any,
  options: PaginationOptions & { where?: any; include?: any } = {}
): Promise<PaginationResult<T>> {
  const page = Math.max(1, options.page || 1)
  const limit = Math.min(100, Math.max(1, options.limit || 10))
  const skip = (page - 1) * limit

  const [data, total] = await Promise.all([
    model.findMany({
      where: options.where,
      include: options.include,
      orderBy: options.orderBy || { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    model.count({ where: options.where }),
  ])

  const pages = Math.ceil(total / limit)

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages,
      hasNext: page < pages,
      hasPrev: page > 1,
    },
  }
}

// Search utility for properties
export interface PropertySearchOptions {
  query?: string
  type?: string
  category?: string
  status?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
  city?: string
  state?: string
  featured?: boolean
  agentId?: string
}

export function buildPropertySearchFilter(options: PropertySearchOptions) {
  const where: any = {}

  if (options.query) {
    where.OR = [
      { title: { contains: options.query, mode: 'insensitive' } },
      { description: { contains: options.query, mode: 'insensitive' } },
      { address: { contains: options.query, mode: 'insensitive' } },
      { city: { contains: options.query, mode: 'insensitive' } },
      { neighborhood: { contains: options.query, mode: 'insensitive' } },
    ]
  }

  if (options.type) where.type = options.type
  if (options.category) where.category = options.category
  if (options.status) where.status = options.status
  if (options.featured !== undefined) where.featured = options.featured
  if (options.agentId) where.agentId = options.agentId
  if (options.city) where.city = { contains: options.city, mode: 'insensitive' }
  if (options.state) where.state = { contains: options.state, mode: 'insensitive' }
  if (options.bedrooms) where.bedrooms = { gte: options.bedrooms }
  if (options.bathrooms) where.bathrooms = { gte: options.bathrooms }

  if (options.minPrice || options.maxPrice) {
    where.price = {}
    if (options.minPrice) where.price.gte = options.minPrice
    if (options.maxPrice) where.price.lte = options.maxPrice
  }

  return where
}

// Audit logging utility
export async function createAuditLog(data: {
  userId?: string
  action: string
  resource: string
  resourceId?: string
  oldData?: any
  newData?: any
  ipAddress?: string
  userAgent?: string
}) {
  try {
    await prisma.auditLog.create({
      data: {
        ...data,
        oldData: data.oldData ? JSON.stringify(data.oldData) : undefined,
        newData: data.newData ? JSON.stringify(data.newData) : undefined,
      },
    })
  } catch (error) {
    console.error('Failed to create audit log:', error)
  }
}

export default prisma
