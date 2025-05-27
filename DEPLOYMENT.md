# Deployment Guide

This guide covers deploying the Real Estate Platform to various hosting providers.

## 🚀 Vercel Deployment (Recommended)

### Prerequisites
1. PostgreSQL database (Supabase, Railway, or Neon recommended)
2. Google AI API key
3. Vercel account

### Step 1: Database Setup
Choose one of these PostgreSQL providers:

#### Option A: Supabase (Free tier available)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string

#### Option B: Railway (Free tier available)
1. Go to [railway.app](https://railway.app)
2. Create a new PostgreSQL database
3. Copy the connection string

#### Option C: Neon (Free tier available)
1. Go to [neon.tech](https://neon.tech)
2. Create a new database
3. Copy the connection string

### Step 2: Environment Variables
Set these environment variables in Vercel:

```bash
DATABASE_URL="your-postgresql-connection-string"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-nextauth-secret-key"
GOOGLE_AI_API_KEY="your-google-ai-api-key"
NODE_ENV="production"
PRISMA_GENERATE_DATAPROXY="true"
```

### Step 3: Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect Next.js
3. Add the environment variables
4. Deploy

### Step 4: Database Migration
After deployment, run database migration:
```bash
# Using Vercel CLI
vercel env pull .env.local
npx prisma db push
npx prisma generate
npm run seed-prisma
```

## 🐳 Docker Deployment

### Prerequisites
- Docker and Docker Compose
- PostgreSQL database

### Step 1: Create docker-compose.yml
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/realestate
      - JWT_SECRET=your-jwt-secret
      - NEXTAUTH_SECRET=your-nextauth-secret
      - GOOGLE_AI_API_KEY=your-google-ai-key
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=realestate
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

### Step 2: Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Step 3: Deploy
```bash
docker-compose up -d
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Prisma Client Not Found
**Error**: `Cannot find module '@prisma/client'`

**Solution**:
```bash
npm run db:generate
# or
npx prisma generate
```

#### 2. Database Connection Issues
**Error**: `Can't reach database server`

**Solutions**:
- Check DATABASE_URL format
- Ensure database is accessible
- Check firewall settings
- Verify credentials

#### 3. Build Failures
**Error**: `Build failed`

**Solutions**:
- Ensure all environment variables are set
- Run `npm run build:setup` locally first
- Check build logs for specific errors

### Environment Variable Format
```bash
# Correct PostgreSQL URL format
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"

# Example with Supabase
DATABASE_URL="postgresql://postgres:your-password@db.your-project.supabase.co:5432/postgres"
```

## 📊 Performance Optimization

### Database Optimization
1. Enable connection pooling
2. Add database indexes
3. Use read replicas for heavy read operations

### Application Optimization
1. Enable Next.js caching
2. Use CDN for static assets
3. Implement Redis for session storage

## 🔒 Security Checklist

- [ ] Use strong JWT secrets
- [ ] Enable HTTPS in production
- [ ] Set secure cookie flags
- [ ] Implement rate limiting
- [ ] Use environment variables for secrets
- [ ] Enable CORS properly
- [ ] Validate all inputs
- [ ] Use prepared statements (Prisma handles this)

## 📈 Monitoring

### Recommended Tools
- Vercel Analytics (for Vercel deployments)
- Sentry for error tracking
- LogRocket for user session recording
- Prisma Pulse for database monitoring

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review deployment logs
3. Verify environment variables
4. Test database connectivity
5. Check Prisma schema validity
