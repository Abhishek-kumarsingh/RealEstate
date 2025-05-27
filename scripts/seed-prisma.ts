import { config } from 'dotenv'
import { resolve } from 'path'
import bcrypt from 'bcryptjs'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })

import { prisma } from '../lib/prisma'

async function seedDatabase() {
  try {
    console.log('🌱 Starting PostgreSQL database seeding with Prisma...')

    // Clear existing data in correct order (respecting foreign key constraints)
    console.log('🗑️  Clearing existing data...')
    
    await prisma.auditLog.deleteMany({})
    await prisma.notification.deleteMany({})
    await prisma.searchHistory.deleteMany({})
    await prisma.propertyView.deleteMany({})
    await prisma.document.deleteMany({})
    await prisma.review.deleteMany({})
    await prisma.favorite.deleteMany({})
    await prisma.inquiry.deleteMany({})
    await prisma.propertyVideo.deleteMany({})
    await prisma.propertyImage.deleteMany({})
    await prisma.transaction.deleteMany({})
    await prisma.property.deleteMany({})
    await prisma.userSession.deleteMany({})
    await prisma.user.deleteMany({})
    await prisma.systemSetting.deleteMany({})

    console.log('✅ Cleared existing data')

    // Create system settings
    console.log('⚙️  Creating system settings...')
    await prisma.systemSetting.createMany({
      data: [
        {
          key: 'site_name',
          value: 'RealEstate Hub',
          type: 'string',
          category: 'general',
          description: 'Website name',
          isPublic: true,
        },
        {
          key: 'max_property_images',
          value: '20',
          type: 'number',
          category: 'properties',
          description: 'Maximum number of images per property',
        },
        {
          key: 'commission_rate',
          value: '0.06',
          type: 'number',
          category: 'financial',
          description: 'Default commission rate (6%)',
        },
      ]
    })

    // Create users
    console.log('👥 Creating users...')
    
    const hashedPassword = await bcrypt.hash('password123', 12)
    
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@realestatehub.com',
        password: hashedPassword,
        role: 'ADMIN',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
        isVerified: true,
        verificationStatus: 'VERIFIED',
        kycStatus: 'VERIFIED',
        phone: '+1-555-0001',
        bio: 'System administrator with full access to all platform features.',
        city: 'New York',
        state: 'NY',
        country: 'USA',
      }
    })

    const agent1 = await prisma.user.create({
      data: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@realestatehub.com',
        password: hashedPassword,
        role: 'AGENT',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
        isVerified: true,
        verificationStatus: 'VERIFIED',
        kycStatus: 'VERIFIED',
        phone: '+1-555-0102',
        bio: 'Experienced real estate agent specializing in luxury homes and commercial properties.',
        licenseNumber: 'RE-2024-001',
        agencyName: 'Premium Properties LLC',
        experienceYears: 8,
        specializations: ['Luxury Homes', 'Commercial', 'Investment Properties'],
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
      }
    })

    const agent2 = await prisma.user.create({
      data: {
        name: 'Michael Chen',
        email: 'michael.chen@realestatehub.com',
        password: hashedPassword,
        role: 'AGENT',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
        isVerified: true,
        verificationStatus: 'VERIFIED',
        kycStatus: 'VERIFIED',
        phone: '+1-555-0103',
        bio: 'Dedicated agent focused on first-time homebuyers and residential properties.',
        licenseNumber: 'RE-2024-002',
        agencyName: 'HomeFinders Realty',
        experienceYears: 5,
        specializations: ['First-Time Buyers', 'Residential', 'Condos'],
        city: 'Miami',
        state: 'FL',
        country: 'USA',
      }
    })

    const regularUser = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: hashedPassword,
        role: 'USER',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
        isVerified: true,
        phone: '+1-555-0104',
        bio: 'Looking for my dream home in a great neighborhood.',
        city: 'Austin',
        state: 'TX',
        country: 'USA',
      }
    })

    console.log('✅ Created users')

    // Create properties
    console.log('🏠 Creating properties...')
    
    const properties = [
      {
        title: 'Luxury Modern Villa with Ocean View',
        description: 'Stunning contemporary villa featuring panoramic ocean views, infinity pool, and state-of-the-art amenities. Perfect for luxury living.',
        price: 2500000,
        type: 'SALE',
        category: 'VILLA',
        status: 'AVAILABLE',
        featured: true,
        address: '123 Ocean Drive',
        city: 'Malibu',
        state: 'CA',
        zipCode: '90265',
        latitude: 34.0259,
        longitude: -118.7798,
        neighborhood: 'Point Dume',
        bedrooms: 5,
        bathrooms: 4.5,
        area: 4500,
        lotSize: 12000,
        yearBuilt: 2020,
        floors: 2,
        parkingSpaces: 3,
        amenities: ['Ocean View', 'Infinity Pool', 'Home Theater', 'Wine Cellar', 'Smart Home'],
        features: ['Hardwood Floors', 'Granite Countertops', 'Walk-in Closets', 'Fireplace'],
        appliances: ['Stainless Steel Appliances', 'Wine Refrigerator', 'Built-in Coffee Machine'],
        utilities: ['Central AC', 'Heating', 'High-Speed Internet'],
        propertyTax: 25000,
        hoaFees: 500,
        insurance: 3000,
        agentId: agent1.id,
      },
      {
        title: 'Charming Downtown Apartment',
        description: 'Beautiful 2-bedroom apartment in the heart of downtown with modern amenities and city views.',
        price: 3500,
        type: 'RENT',
        category: 'APARTMENT',
        status: 'AVAILABLE',
        featured: true,
        address: '456 Main Street, Unit 12A',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        latitude: 40.7505,
        longitude: -73.9934,
        neighborhood: 'Midtown',
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        yearBuilt: 2018,
        floors: 1,
        parkingSpaces: 1,
        amenities: ['City View', 'Gym', 'Rooftop Terrace', 'Concierge'],
        features: ['Hardwood Floors', 'In-unit Laundry', 'Balcony'],
        appliances: ['Dishwasher', 'Microwave', 'Refrigerator'],
        utilities: ['Central AC', 'Heating'],
        rentType: 'MONTHLY',
        deposit: 7000,
        petPolicy: 'CATS_ONLY',
        leaseTerm: 12,
        agentId: agent2.id,
      },
      {
        title: 'Spacious Family Home with Garden',
        description: 'Perfect family home with large backyard, updated kitchen, and excellent school district.',
        price: 750000,
        type: 'SALE',
        category: 'HOUSE',
        status: 'AVAILABLE',
        featured: false,
        address: '789 Maple Avenue',
        city: 'Austin',
        state: 'TX',
        zipCode: '78701',
        latitude: 30.2672,
        longitude: -97.7431,
        neighborhood: 'Hyde Park',
        bedrooms: 4,
        bathrooms: 3,
        area: 2800,
        lotSize: 8000,
        yearBuilt: 2015,
        floors: 2,
        parkingSpaces: 2,
        amenities: ['Large Backyard', 'Updated Kitchen', 'Master Suite'],
        features: ['Hardwood Floors', 'Granite Countertops', 'Walk-in Closets'],
        appliances: ['Stainless Steel Appliances', 'Dishwasher'],
        utilities: ['Central AC', 'Heating', 'Sprinkler System'],
        propertyTax: 12000,
        insurance: 1500,
        agentId: agent1.id,
      },
    ]

    const createdProperties = []
    for (const propertyData of properties) {
      const property = await prisma.property.create({
        data: propertyData
      })
      createdProperties.push(property)
    }

    console.log('✅ Created properties')

    // Create property images
    console.log('📸 Creating property images...')
    
    const propertyImages = [
      // Villa images
      { propertyId: createdProperties[0].id, url: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg', isPrimary: true, order: 1 },
      { propertyId: createdProperties[0].id, url: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg', isPrimary: false, order: 2 },
      { propertyId: createdProperties[0].id, url: 'https://images.pexels.com/photos/1396125/pexels-photo-1396125.jpeg', isPrimary: false, order: 3 },
      
      // Apartment images
      { propertyId: createdProperties[1].id, url: 'https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg', isPrimary: true, order: 1 },
      { propertyId: createdProperties[1].id, url: 'https://images.pexels.com/photos/2635041/pexels-photo-2635041.jpeg', isPrimary: false, order: 2 },
      
      // House images
      { propertyId: createdProperties[2].id, url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg', isPrimary: true, order: 1 },
      { propertyId: createdProperties[2].id, url: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg', isPrimary: false, order: 2 },
    ]

    await prisma.propertyImage.createMany({
      data: propertyImages
    })

    console.log('✅ Created property images')

    console.log('✅ Database seeding completed successfully!')
    console.log('\n📋 Test Accounts:')
    console.log('Admin: admin@realestatehub.com / password123')
    console.log('Agent 1: sarah.johnson@realestatehub.com / password123')
    console.log('Agent 2: michael.chen@realestatehub.com / password123')
    console.log('User: john.doe@example.com / password123')
    console.log('\n🏠 Created Properties:', createdProperties.length)

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seed function
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('🎉 Seeding completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error)
      process.exit(1)
    })
}

export default seedDatabase
