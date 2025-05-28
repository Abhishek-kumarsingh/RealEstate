#!/usr/bin/env node

/**
 * Windows-specific Prisma client generation script
 * Handles permission issues common on Windows systems
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Starting Windows-safe Prisma client generation...');

// Clean up any existing Prisma client
const prismaClientPath = path.join(__dirname, '..', 'node_modules', '.prisma');
if (fs.existsSync(prismaClientPath)) {
  try {
    console.log('🧹 Cleaning existing Prisma client...');
    fs.rmSync(prismaClientPath, { recursive: true, force: true });
  } catch (error) {
    console.warn('⚠️  Could not clean existing Prisma client:', error.message);
  }
}

// Try different generation strategies
const strategies = [
  {
    name: 'Standard Generation',
    command: 'npx prisma generate',
    description: 'Standard Prisma client generation with query engine'
  },
  {
    name: 'Force Generation',
    command: 'npx prisma generate --force-reset',
    description: 'Force reset and regenerate'
  },
  {
    name: 'No Engine Generation',
    command: 'npx prisma generate --no-engine',
    description: 'Generate client without query engine (fallback only)'
  }
];

let success = false;

for (const strategy of strategies) {
  try {
    console.log(`\n🚀 Trying: ${strategy.name}`);
    console.log(`📝 ${strategy.description}`);

    execSync(strategy.command, {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
      timeout: 60000 // 60 seconds timeout
    });

    console.log(`✅ Success with: ${strategy.name}`);
    success = true;
    break;
  } catch (error) {
    console.log(`❌ Failed with: ${strategy.name}`);
    console.log(`   Error: ${error.message}`);
    continue;
  }
}

if (!success) {
  console.error('\n❌ All Prisma generation strategies failed!');
  console.error('\n🔧 Manual steps to try:');
  console.error('1. Close all Node.js processes');
  console.error('2. Delete node_modules\\.prisma folder');
  console.error('3. Run: npx prisma generate --no-engine');
  console.error('4. If that fails, restart your computer and try again');
  process.exit(1);
}

console.log('\n🎉 Prisma client generation completed successfully!');
console.log('✨ You can now run your application with: npm run dev');
