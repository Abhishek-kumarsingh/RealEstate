import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query', 'error', 'warn'],
  errorFormat: 'pretty',
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

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
