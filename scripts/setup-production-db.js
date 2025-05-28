#!/usr/bin/env node

/**
 * Production Database Setup Script
 * Run this after deploying to Vercel to set up your database
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Setting up production database...');

try {
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    console.log('Please set your DATABASE_URL in Vercel environment variables');
    process.exit(1);
  }

  console.log('✅ DATABASE_URL found');

  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Push database schema
  console.log('🗄️ Pushing database schema...');
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });

  // Seed database (optional)
  if (process.argv.includes('--seed')) {
    console.log('🌱 Seeding database...');
    try {
      execSync('npm run seed-prisma', { stdio: 'inherit' });
    } catch (error) {
      console.warn('⚠️ Seeding failed, but continuing...');
    }
  }

  console.log('✅ Production database setup complete!');
} catch (error) {
  console.error('❌ Database setup failed:', error.message);
  process.exit(1);
}
