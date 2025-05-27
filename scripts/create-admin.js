const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  const prisma = new PrismaClient();

  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@realestatehub.com' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists, deleting and recreating...');
      await prisma.user.delete({
        where: { email: 'admin@realestatehub.com' }
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: 'admin@realestatehub.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN',
        isVerified: true,
        isActive: true,
        verificationStatus: 'VERIFIED'
      }
    });

    console.log('Admin user created successfully:', admin.email);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
