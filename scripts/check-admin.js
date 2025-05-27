const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function checkAdmin() {
  const prisma = new PrismaClient();
  
  try {
    // Find the admin user
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@realestatehub.com' }
    });

    if (!admin) {
      console.log('❌ Admin user not found');
      return;
    }

    console.log('✅ Admin user found:');
    console.log('- ID:', admin.id);
    console.log('- Email:', admin.email);
    console.log('- Name:', admin.name);
    console.log('- Role:', admin.role);
    console.log('- Is Verified:', admin.isVerified);
    console.log('- Is Active:', admin.isActive);
    console.log('- Password Hash:', admin.password.substring(0, 20) + '...');

    // Test password verification
    const testPassword = 'admin123';
    const isValid = await bcrypt.compare(testPassword, admin.password);
    console.log('- Password "admin123" valid:', isValid);

    // Test different variations
    const variations = ['Admin123', 'ADMIN123', 'admin', '123456'];
    for (const variation of variations) {
      const isValidVariation = await bcrypt.compare(variation, admin.password);
      console.log(`- Password "${variation}" valid:`, isValidVariation);
    }

  } catch (error) {
    console.error('Error checking admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();
