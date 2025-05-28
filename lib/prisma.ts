import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

// Extend globalThis for dev environment caching
declare global {
  var prisma: ReturnType<typeof createPrismaClient> | undefined;
}

function createPrismaClient() {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    console.warn("Skipping Prisma client creation during build phase");
    return null;
  }

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
    });

    return client.$extends(withAccelerate());
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

if (!prismaInstance) {
  throw new Error(
    "Prisma client creation failed. Check environment configuration."
  );
}

// Export the extended Prisma instance
export const prisma = prismaInstance;
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
