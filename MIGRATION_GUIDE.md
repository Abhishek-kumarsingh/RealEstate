# MongoDB to PostgreSQL + Prisma Migration Guide

This guide will help you migrate from MongoDB/Mongoose to PostgreSQL with Prisma for your real estate platform.

## 🎯 Migration Overview

### What's Changed
- **Database**: MongoDB → PostgreSQL
- **ORM**: Mongoose → Prisma
- **Schema**: Document-based → Relational with proper foreign keys
- **Type Safety**: Enhanced TypeScript support with Prisma Client
- **Performance**: Better query optimization and indexing

### New Features Added
- **Enhanced User Management**: KYC verification, agent licensing, session management
- **Advanced Property Features**: Multiple images/videos, financial details, SEO optimization
- **Transaction Management**: Complete property transaction lifecycle
- **Analytics & Tracking**: Property views, search history, audit logs
- **Document Management**: Property documents, contracts, certificates
- **Notification System**: Real-time notifications for users
- **Review System**: Property and agent reviews

## 🚀 Quick Migration Steps

### 1. Install Dependencies
```bash
npm install prisma @prisma/client pg @types/pg
```

### 2. Set Up PostgreSQL Database
```bash
# Install PostgreSQL (if not already installed)
# Windows: Download from https://www.postgresql.org/download/windows/
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql

# Create database
createdb realestate

# Or using psql
psql -U postgres
CREATE DATABASE realestate;
\q
```

### 3. Update Environment Variables
Update your `.env.local` file:
```env
# Replace MongoDB URI with PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/realestate?schema=public"

# For local development
DATABASE_URL="postgresql://postgres:password@localhost:5432/realestate?schema=public"
```

### 4. Generate Prisma Client
```bash
npm run db:generate
```

### 5. Push Schema to Database
```bash
npm run db:push
```

### 6. Seed Database with Sample Data
```bash
npm run seed-prisma
```

## 📊 Schema Comparison

### User Model
**Before (MongoDB/Mongoose):**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String,
  role: String,
  avatar: String,
  phone: String,
  bio: String,
  isVerified: Boolean
}
```

**After (PostgreSQL/Prisma):**
```prisma
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  name        String
  password    String
  role        UserRole @default(USER)
  avatar      String?
  phone       String?
  bio         String?
  isVerified  Boolean  @default(false)
  
  // Enhanced fields
  licenseNumber     String?
  agencyName        String?
  experienceYears   Int?
  specializations   String[]
  verificationStatus VerificationStatus
  kycStatus         KYCStatus
  kycVerifiedAt     DateTime?
  
  // Relations
  properties        Property[]
  inquiries         Inquiry[]
  favorites         Favorite[]
  // ... more relations
}
```

### Property Model
**Enhanced with:**
- Proper location handling (latitude/longitude)
- Financial details (property tax, HOA fees, insurance)
- Rental-specific fields (deposit, pet policy, lease term)
- SEO optimization (slug, meta tags, keywords)
- Analytics (view count, inquiry count)
- Media management (separate image/video tables)

## 🔄 API Migration

### Old MongoDB API
```typescript
// Old way with MongoDB
import connectDB from '@/lib/mongodb'
import Property from '@/lib/models/Property'

export async function GET() {
  await connectDB()
  const properties = await Property.find({})
    .populate('agent', 'name email phone avatar')
  return NextResponse.json({ properties })
}
```

### New Prisma API
```typescript
// New way with Prisma
import { prisma } from '@/lib/prisma'

export async function GET() {
  const properties = await prisma.property.findMany({
    include: {
      agent: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          avatar: true,
        }
      },
      images: true,
      _count: {
        select: {
          favorites: true,
          inquiries: true,
        }
      }
    }
  })
  return NextResponse.json({ properties })
}
```

## 🛠️ Available Scripts

```bash
# Database operations
npm run db:generate    # Generate Prisma client
npm run db:push       # Push schema to database
npm run db:migrate    # Create and run migrations
npm run db:studio     # Open Prisma Studio (database GUI)
npm run db:reset      # Reset database and run migrations

# Seeding
npm run seed-prisma   # Seed with comprehensive real estate data
```

## 🔍 Key Benefits

### 1. Type Safety
- Full TypeScript support with generated types
- Compile-time error checking
- IntelliSense support

### 2. Performance
- Optimized queries with proper indexing
- Connection pooling
- Query optimization

### 3. Scalability
- Relational database benefits
- ACID compliance
- Better data integrity

### 4. Developer Experience
- Prisma Studio for database visualization
- Auto-generated documentation
- Migration system

## 📝 Migration Checklist

- [ ] Install PostgreSQL
- [ ] Update environment variables
- [ ] Generate Prisma client
- [ ] Push schema to database
- [ ] Run seed script
- [ ] Update API routes to use Prisma
- [ ] Test authentication flows
- [ ] Test property CRUD operations
- [ ] Verify data relationships
- [ ] Update frontend to use new API endpoints

## 🚨 Important Notes

1. **Backup Data**: Always backup your MongoDB data before migration
2. **Test Thoroughly**: Test all functionality with the new database
3. **Environment Variables**: Update all environment configurations
4. **API Endpoints**: Update frontend to use new API endpoints if needed
5. **Authentication**: JWT tokens remain the same, but session management is enhanced

## 🆘 Troubleshooting

### Common Issues

1. **Connection Error**: Ensure PostgreSQL is running and credentials are correct
2. **Schema Sync Issues**: Run `npm run db:push` to sync schema
3. **Type Errors**: Run `npm run db:generate` to regenerate Prisma client
4. **Migration Errors**: Use `npm run db:reset` to reset and start fresh

### Getting Help

- Check Prisma documentation: https://www.prisma.io/docs
- PostgreSQL documentation: https://www.postgresql.org/docs
- Open an issue in the project repository

## 🎉 Next Steps

After successful migration:
1. Explore Prisma Studio: `npm run db:studio`
2. Set up proper database backups
3. Configure production database
4. Implement advanced features like full-text search
5. Set up monitoring and logging
