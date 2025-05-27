import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import connectDB from '../lib/mongodb';
import User from '../lib/models/User';
import Property from '../lib/models/Property';

async function seedDatabase() {
  try {
    await connectDB();

    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Property.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create users
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@realestatehub.com',
      password: 'admin123',
      role: 'admin',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
      isVerified: true
    });

    const agentUser1 = new User({
      name: 'Sarah Johnson',
      email: 'sarah.johnson@realestatehub.com',
      password: 'agent123',
      role: 'agent',
      avatar: 'https://images.pexels.com/photos/5325840/pexels-photo-5325840.jpeg',
      phone: '(310) 555-1234',
      bio: 'Experienced real estate agent specializing in luxury properties.',
      isVerified: true
    });

    const agentUser2 = new User({
      name: 'Michael Chen',
      email: 'michael.chen@realestatehub.com',
      password: 'agent123',
      role: 'agent',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      phone: '(213) 555-5678',
      bio: 'Downtown specialist with 10+ years of experience.',
      isVerified: true
    });

    const regularUser = new User({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'user123',
      role: 'user',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
      isVerified: true
    });

    await Promise.all([
      adminUser.save(),
      agentUser1.save(),
      agentUser2.save(),
      regularUser.save()
    ]);

    console.log('👥 Created users');

    // Create properties
    const properties = [
      {
        title: 'Modern Luxury Villa with Ocean View',
        description: 'Stunning modern villa with panoramic ocean views, featuring an infinity pool, spacious living areas, and high-end finishes throughout.',
        price: 1250000,
        type: 'sale',
        category: 'house',
        location: {
          address: '123 Oceanfront Drive',
          city: 'Malibu',
          state: 'CA',
          zipCode: '90265',
          coordinates: {
            type: 'Point',
            coordinates: [-118.779757, 34.025922] // [longitude, latitude]
          }
        },
        features: {
          bedrooms: 5,
          bathrooms: 4.5,
          area: 4200,
          yearBuilt: 2019
        },
        amenities: ['Swimming Pool', 'Ocean View', 'Home Theater', 'Smart Home System', 'Wine Cellar'],
        images: [
          'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
          'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg'
        ],
        status: 'available',
        featured: true,
        agent: agentUser1._id
      },
      {
        title: 'Downtown Luxury Apartment',
        description: 'Modern luxury apartment in the heart of downtown, featuring floor-to-ceiling windows and premium amenities.',
        price: 4500,
        type: 'rent',
        category: 'apartment',
        location: {
          address: '456 City Center Blvd',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90017',
          coordinates: {
            type: 'Point',
            coordinates: [-118.243683, 34.052235] // [longitude, latitude]
          }
        },
        features: {
          bedrooms: 2,
          bathrooms: 2,
          area: 1500,
          yearBuilt: 2020
        },
        amenities: ['Fitness Center', 'Rooftop Lounge', 'Concierge Service', 'Pet Friendly'],
        images: [
          'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
          'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg'
        ],
        status: 'available',
        featured: true,
        agent: agentUser2._id
      },
      {
        title: 'Suburban Family Home',
        description: 'Beautiful family home in a quiet suburban neighborhood with spacious backyard and updated kitchen.',
        price: 750000,
        type: 'sale',
        category: 'house',
        location: {
          address: '101 Maple Street',
          city: 'Pasadena',
          state: 'CA',
          zipCode: '91101',
          coordinates: {
            type: 'Point',
            coordinates: [-118.144515, 34.147785] // [longitude, latitude]
          }
        },
        features: {
          bedrooms: 4,
          bathrooms: 3,
          area: 2800,
          yearBuilt: 2005
        },
        amenities: ['Backyard', 'Garage', 'Updated Kitchen', 'Fireplace'],
        images: [
          'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
          'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg'
        ],
        status: 'available',
        featured: true,
        agent: agentUser1._id
      },
      {
        title: 'Luxury Penthouse with City Views',
        description: 'Spectacular penthouse apartment with 360-degree city views, private elevator access, and premium finishes throughout.',
        price: 2850000,
        type: 'sale',
        category: 'apartment',
        location: {
          address: '789 Skyline Tower',
          city: 'Beverly Hills',
          state: 'CA',
          zipCode: '90210',
          coordinates: {
            type: 'Point',
            coordinates: [-118.400356, 34.073620] // [longitude, latitude]
          }
        },
        features: {
          bedrooms: 3,
          bathrooms: 3.5,
          area: 3200,
          yearBuilt: 2021
        },
        amenities: ['Private Elevator', 'City Views', 'Rooftop Terrace', 'Smart Home', 'Concierge', 'Valet Parking'],
        images: [
          'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg',
          'https://images.pexels.com/photos/1974596/pexels-photo-1974596.jpeg'
        ],
        status: 'available',
        featured: true,
        agent: agentUser2._id
      }
    ];

    await Property.insertMany(properties);

    console.log('🏠 Created properties');
    console.log('✅ Database seeding completed successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('Admin: admin@realestatehub.com / admin123');
    console.log('Agent 1: sarah.johnson@realestatehub.com / agent123');
    console.log('Agent 2: michael.chen@realestatehub.com / agent123');
    console.log('User: john.doe@example.com / user123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedDatabase();
