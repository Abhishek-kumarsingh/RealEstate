import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma client with proper error handling
function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  })
}

// Create the client
export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

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
