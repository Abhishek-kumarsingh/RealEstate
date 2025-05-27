import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { paginate, buildPropertySearchFilter } from '@/lib/db-utils'

// GET /api/properties-prisma - Get properties with advanced filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract search parameters
    const searchOptions = {
      query: searchParams.get('query') || undefined,
      type: searchParams.get('type') || undefined,
      category: searchParams.get('category') || undefined,
      status: searchParams.get('status') || 'AVAILABLE',
      minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
      bedrooms: searchParams.get('bedrooms') ? parseInt(searchParams.get('bedrooms')!) : undefined,
      bathrooms: searchParams.get('bathrooms') ? parseFloat(searchParams.get('bathrooms')!) : undefined,
      city: searchParams.get('city') || undefined,
      state: searchParams.get('state') || undefined,
      featured: searchParams.get('featured') === 'true' ? true : undefined,
      agentId: searchParams.get('agentId') || undefined,
    }

    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sort = searchParams.get('sort') || 'createdAt'
    const order = searchParams.get('order') || 'desc'

    // Build filter
    const where = buildPropertySearchFilter(searchOptions)

    // Build orderBy
    const orderBy: any = {}
    if (sort === 'price') {
      orderBy.price = order
    } else if (sort === 'createdAt') {
      orderBy.createdAt = order
    } else if (sort === 'updatedAt') {
      orderBy.updatedAt = order
    } else {
      orderBy.createdAt = 'desc'
    }

    // Get paginated results
    const result = await paginate(prisma.property, {
      page,
      limit,
      where,
      orderBy,
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            bio: true,
            agencyName: true,
            licenseNumber: true,
            verificationStatus: true,
          }
        },
        images: {
          orderBy: { order: 'asc' },
          take: 5
        },
        _count: {
          select: {
            favorites: true,
            inquiries: true,
            propertyViews: true,
          }
        }
      }
    })

    // Track search if query provided
    if (searchOptions.query) {
      await prisma.searchHistory.create({
        data: {
          query: searchOptions.query,
          filters: searchOptions,
          results: result.pagination.total,
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
        }
      }).catch(console.error) // Don't fail the request if search tracking fails
    }

    return NextResponse.json(result, { status: 200 })

  } catch (error: any) {
    console.error('Properties fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/properties-prisma - Create new property (requires authentication)
export async function POST(request: NextRequest) {
  try {
    // For now, we'll skip authentication middleware and assume it's handled elsewhere
    // In a real implementation, you'd extract user info from JWT token
    
    const data = await request.json()
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'price', 'type', 'category', 'address', 'city', 'state', 'zipCode', 'agentId']
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Validate agent exists
    const agent = await prisma.user.findUnique({
      where: { 
        id: data.agentId,
        role: { in: ['AGENT', 'ADMIN'] },
        isActive: true 
      }
    })

    if (!agent) {
      return NextResponse.json(
        { error: 'Invalid agent ID' },
        { status: 400 }
      )
    }

    // Create property
    const property = await prisma.property.create({
      data: {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        type: data.type.toUpperCase(),
        category: data.category.toUpperCase(),
        status: data.status?.toUpperCase() || 'AVAILABLE',
        featured: data.featured || false,
        
        // Location
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country || 'USA',
        latitude: data.latitude ? parseFloat(data.latitude) : null,
        longitude: data.longitude ? parseFloat(data.longitude) : null,
        neighborhood: data.neighborhood,
        
        // Features
        bedrooms: data.bedrooms ? parseInt(data.bedrooms) : null,
        bathrooms: data.bathrooms ? parseFloat(data.bathrooms) : null,
        area: data.area ? parseFloat(data.area) : null,
        lotSize: data.lotSize ? parseFloat(data.lotSize) : null,
        yearBuilt: data.yearBuilt ? parseInt(data.yearBuilt) : null,
        floors: data.floors ? parseInt(data.floors) : null,
        parkingSpaces: data.parkingSpaces ? parseInt(data.parkingSpaces) : null,
        
        // Details
        amenities: data.amenities || [],
        features: data.features || [],
        appliances: data.appliances || [],
        utilities: data.utilities || [],
        
        // Financial
        propertyTax: data.propertyTax ? parseFloat(data.propertyTax) : null,
        hoaFees: data.hoaFees ? parseFloat(data.hoaFees) : null,
        insurance: data.insurance ? parseFloat(data.insurance) : null,
        
        // Rental specific
        rentType: data.rentType?.toUpperCase(),
        deposit: data.deposit ? parseFloat(data.deposit) : null,
        petPolicy: data.petPolicy?.toUpperCase(),
        leaseTerm: data.leaseTerm ? parseInt(data.leaseTerm) : null,
        
        // SEO
        slug: data.slug,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        keywords: data.keywords || [],
        
        agentId: data.agentId,
      },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Property created successfully',
      property
    }, { status: 201 })

  } catch (error: any) {
    console.error('Property creation error:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Property with this slug already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
