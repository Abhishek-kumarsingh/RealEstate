import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requireRole, AuthenticatedRequest } from '@/lib/middleware/auth';

// GET /api/properties - Get all properties with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Build where object for Prisma
    const where: any = {};

    // Type filter
    const type = searchParams.get('type');
    if (type && ['SALE', 'RENT', 'COMMERCIAL'].includes(type.toUpperCase())) {
      where.type = type.toUpperCase();
    }

    // Status filter
    const status = searchParams.get('status');
    if (status && ['AVAILABLE', 'PENDING', 'SOLD'].includes(status.toUpperCase())) {
      where.status = status.toUpperCase();
    } else {
      // Default to available properties only
      where.status = 'AVAILABLE';
    }

    // Featured filter
    const featured = searchParams.get('featured');
    if (featured === 'true') {
      where.featured = true;
    }

    // Category filter
    const category = searchParams.get('category');
    if (category) {
      where.category = category.toUpperCase();
    }

    // Price range filter
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseInt(minPrice);
      if (maxPrice) where.price.lte = parseInt(maxPrice);
    }

    // Location filter
    const location = searchParams.get('location');
    if (location) {
      where.OR = [
        { city: { contains: location, mode: 'insensitive' } },
        { state: { contains: location, mode: 'insensitive' } },
        { address: { contains: location, mode: 'insensitive' } }
      ];
    }

    // Features filters
    const bedrooms = searchParams.get('bedrooms');
    if (bedrooms) {
      where.bedrooms = { gte: parseInt(bedrooms) };
    }

    const bathrooms = searchParams.get('bathrooms');
    if (bathrooms) {
      where.bathrooms = { gte: parseInt(bathrooms) };
    }

    // Area filter
    const minArea = searchParams.get('minArea');
    const maxArea = searchParams.get('maxArea');
    if (minArea || maxArea) {
      where.area = {};
      if (minArea) where.area.gte = parseInt(minArea);
      if (maxArea) where.area.lte = parseInt(maxArea);
    }

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Sort
    const sortParam = searchParams.get('sort') || 'createdAt';
    const orderBy: any = {};
    if (sortParam.startsWith('-')) {
      orderBy[sortParam.substring(1)] = 'desc';
    } else {
      orderBy[sortParam] = 'asc';
    }

    // Execute query
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          agent: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              avatar: true
            }
          },
          images: true
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.property.count({ where })
    ]);

    return NextResponse.json({
      properties,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('Properties fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/properties - Create new property (agents and admins only)
async function createProperty(request: AuthenticatedRequest) {
  try {
    const propertyData = await request.json();

    // Set the agent to the current user (unless admin is creating for another agent)
    if (request.user?.role === 'AGENT') {
      propertyData.agentId = request.user.userId;
    } else if (request.user?.role === 'ADMIN' && !propertyData.agentId) {
      propertyData.agentId = request.user.userId;
    }

    // Prepare property data for Prisma
    const {
      title,
      description,
      price,
      type,
      category,
      address,
      city,
      state,
      zipCode,
      latitude,
      longitude,
      bedrooms,
      bathrooms,
      area,
      yearBuilt,
      amenities,
      images,
      status = 'AVAILABLE',
      featured = false,
      agentId
    } = propertyData;

    const property = await prisma.property.create({
      data: {
        title,
        description,
        price,
        type: type.toUpperCase(),
        category: category.toUpperCase(),
        address,
        city,
        state,
        zipCode,
        latitude: latitude || 0,
        longitude: longitude || 0,
        bedrooms,
        bathrooms,
        area,
        yearBuilt,
        amenities: amenities || [],
        status: status.toUpperCase(),
        featured,
        agentId,
        // Create images if provided
        images: images ? {
          create: images.map((url: string, index: number) => ({
            url,
            alt: `Property image ${index + 1}`,
            isPrimary: index === 0
          }))
        } : undefined
      },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true
          }
        },
        images: true
      }
    });

    return NextResponse.json({
      message: 'Property created successfully',
      property
    }, { status: 201 });

  } catch (error: any) {
    console.error('Property creation error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = requireRole(['AGENT', 'ADMIN'])(createProperty);
