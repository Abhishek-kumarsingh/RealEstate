import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Property from '@/lib/models/Property';
import { requireAuth, requireRole, AuthenticatedRequest } from '@/lib/middleware/auth';

// GET /api/properties/[id] - Get single property
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const property = await Property.findById(params.id)
      .populate('agent', 'name email phone avatar bio');
    
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ property }, { status: 200 });
    
  } catch (error: any) {
    console.error('Property fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/properties/[id] - Update property
async function updateProperty(
  request: AuthenticatedRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const property = await Property.findById(params.id);
    
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }
    
    // Check permissions - agents can only update their own properties
    if (request.user?.role === 'agent' && property.agent.toString() !== request.user.userId) {
      return NextResponse.json(
        { error: 'You can only update your own properties' },
        { status: 403 }
      );
    }
    
    const updateData = await request.json();
    
    // Prevent agents from changing the agent field
    if (request.user?.role === 'agent') {
      delete updateData.agent;
    }
    
    Object.assign(property, updateData);
    await property.save();
    
    // Populate agent info
    await property.populate('agent', 'name email phone avatar bio');
    
    return NextResponse.json({
      message: 'Property updated successfully',
      property
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Property update error:', error);
    
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

// DELETE /api/properties/[id] - Delete property
async function deleteProperty(
  request: AuthenticatedRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const property = await Property.findById(params.id);
    
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }
    
    // Check permissions - agents can only delete their own properties
    if (request.user?.role === 'agent' && property.agent.toString() !== request.user.userId) {
      return NextResponse.json(
        { error: 'You can only delete your own properties' },
        { status: 403 }
      );
    }
    
    await Property.findByIdAndDelete(params.id);
    
    return NextResponse.json({
      message: 'Property deleted successfully'
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Property deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const PUT = requireRole(['agent', 'admin'])(updateProperty);
export const DELETE = requireRole(['agent', 'admin'])(deleteProperty);
