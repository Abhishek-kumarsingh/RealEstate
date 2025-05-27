#!/usr/bin/env node

/**
 * Build setup script for Prisma
 * Ensures Prisma client is generated before build
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up build environment...');

// Check if Prisma schema exists
const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
if (!fs.existsSync(schemaPath)) {
  console.error('❌ Prisma schema not found at:', schemaPath);
  process.exit(1);
}

console.log('✅ Prisma schema found');

// Generate Prisma client
try {
  console.log('🔄 Generating Prisma client...');
  execSync('npx prisma generate', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('✅ Prisma client generated successfully');
} catch (error) {
  console.error('❌ Failed to generate Prisma client:', error.message);
  process.exit(1);
}

// Check if client was generated
const clientPath = path.join(process.cwd(), 'node_modules', '.prisma', 'client');
if (!fs.existsSync(clientPath)) {
  console.error('❌ Prisma client not found after generation');
  process.exit(1);
}

console.log('✅ Build setup completed successfully');
