import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | null | undefined
}

// Create Prisma client with proper error handling
function createPrismaClient(): PrismaClient | null {
  // Skip Prisma client creation during build time
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    console.warn('Skipping Prisma client creation during build phase')
    return null
  }

  // Skip if no DATABASE_URL is provided
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL not found, skipping Prisma client creation')
    return null
  }

  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      errorFormat: 'pretty',
    })
  } catch (error) {
    console.error('Failed to create Prisma client:', error)
    return null
  }
}

// Create the client
const prismaInstance = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prismaInstance
}

// Export a non-null version for TypeScript
export const prisma = prismaInstance as PrismaClient

export default prisma

// Type exports for better TypeScript support
export type {
  User,
  Property,
  PropertyImage,
  PropertyVideo,
  Inquiry,
  Favorite,
  Review,
  Transaction,
  Document,
  PropertyView,
  SearchHistory,
  Notification,
  SystemSetting,
  AuditLog,
  UserSession,
  UserRole,
  PropertyType,
  PropertyCategory,
  PropertyStatus,
  InquiryStatus,
  TransactionStatus,
  TransactionType,
  DocumentType,
  NotificationType,
  VerificationStatus,
  KYCStatus,
  RentType,
  PetPolicy,
} from '@prisma/client'
