import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

// Type for the extended Prisma client
type ExtendedPrismaClient = ReturnType<PrismaClient['$extends']>;

// Extend globalThis for dev environment caching
declare global {
  var prisma: ReturnType<typeof createPrismaClient> | undefined;
}

function createPrismaClient() {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL not found, skipping Prisma client creation");
    return null;
  }

  try {
    const client = new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
      errorFormat: "pretty",
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });

    // Only use Accelerate if URL starts with prisma://
    if (process.env.DATABASE_URL?.startsWith('prisma://')) {
      return client.$extends(withAccelerate());
    }

    return client;
  } catch (error) {
    console.error("Failed to create Prisma client:", error);
    return null;
  }
}

// Initialize client
const prismaInstance = globalThis.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prismaInstance;
}

// Export the extended Prisma instance with type assertion for build compatibility
export const prisma = prismaInstance as any;
export default prisma;

// Export Prisma types
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
} from "@prisma/client";
