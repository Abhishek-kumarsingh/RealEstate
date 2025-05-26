import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Property from '@/lib/models/Property';
import { requireAuth, requireRole, AuthenticatedRequest } from '@/lib/middleware/auth';

// GET /api/properties - Get all properties with filtering
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    
    // Build filter object
    const filter: any = {};
    
    // Type filter
    const type = searchParams.get('type');
    if (type && ['sale', 'rent', 'commercial'].includes(type)) {
      filter.type = type;
    }
    
    // Status filter
    const status = searchParams.get('status');
    if (status && ['available', 'pending', 'sold'].includes(status)) {
      filter.status = status;
    } else {
      // Default to available properties only
      filter.status = 'available';
    }
    
    // Featured filter
    const featured = searchParams.get('featured');
    if (featured === 'true') {
      filter.featured = true;
    }
    
    // Category filter
    const category = searchParams.get('category');
    if (category) {
      filter.category = category;
    }
    
    // Price range filter
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }
    
    // Location filter
    const location = searchParams.get('location');
    if (location) {
      filter.$or = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.state': { $regex: location, $options: 'i' } },
        { 'location.address': { $regex: location, $options: 'i' } }
      ];
    }
    
    // Features filters
    const bedrooms = searchParams.get('bedrooms');
    if (bedrooms) {
      filter['features.bedrooms'] = { $gte: parseInt(bedrooms) };
    }
    
    const bathrooms = searchParams.get('bathrooms');
    if (bathrooms) {
      filter['features.bathrooms'] = { $gte: parseInt(bathrooms) };
    }
    
    // Area filter
    const minArea = searchParams.get('minArea');
    const maxArea = searchParams.get('maxArea');
    if (minArea || maxArea) {
      filter['features.area'] = {};
      if (minArea) filter['features.area'].$gte = parseInt(minArea);
      if (maxArea) filter['features.area'].$lte = parseInt(maxArea);
    }
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Sort
    const sort = searchParams.get('sort') || '-createdAt';
    
    // Execute query
    const properties = await Property.find(filter)
      .populate('agent', 'name email phone avatar')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    const total = await Property.countDocuments(filter);
    
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
    await connectDB();
    
    const propertyData = await request.json();
    
    // Set the agent to the current user (unless admin is creating for another agent)
    if (request.user?.role === 'agent') {
      propertyData.agent = request.user.userId;
    } else if (request.user?.role === 'admin' && !propertyData.agent) {
      propertyData.agent = request.user.userId;
    }
    
    const property = new Property(propertyData);
    await property.save();
    
    // Populate agent info
    await property.populate('agent', 'name email phone avatar');
    
    return NextResponse.json({
      message: 'Property created successfully',
      property
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Property creation error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = requireRole(['agent', 'admin'])(createProperty);
