import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Inquiry from '@/lib/models/Inquiry';
import Property from '@/lib/models/Property';
import { requireAuth, AuthenticatedRequest } from '@/lib/middleware/auth';

// GET /api/inquiries - Get user's inquiries
async function getInquiries(request: AuthenticatedRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const role = request.user?.role;
    
    let filter: any = {};
    
    if (role === 'user') {
      // Users see only their own inquiries
      filter.user = request.user?.userId;
    } else if (role === 'agent') {
      // Agents see inquiries for their properties
      filter.agent = request.user?.userId;
    }
    // Admins see all inquiries (no filter)
    
    const status = searchParams.get('status');
    if (status && ['pending', 'responded', 'closed'].includes(status)) {
      filter.status = status;
    }
    
    const inquiries = await Inquiry.find(filter)
      .populate('property', 'title price type location images')
      .populate('user', 'name email avatar')
      .populate('agent', 'name email phone avatar')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({
      inquiries
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Inquiries fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/inquiries - Create new inquiry
async function createInquiry(request: AuthenticatedRequest) {
  try {
    await connectDB();
    
    const { propertyId, message, contactInfo } = await request.json();
    
    if (!propertyId || !message || !contactInfo) {
      return NextResponse.json(
        { error: 'Property ID, message, and contact info are required' },
        { status: 400 }
      );
    }
    
    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }
    
    // Create inquiry
    const inquiry = new Inquiry({
      property: propertyId,
      user: request.user?.userId,
      agent: property.agent,
      message,
      contactInfo
    });
    
    await inquiry.save();
    
    // Populate related data
    await inquiry.populate([
      { path: 'property', select: 'title price type location' },
      { path: 'user', select: 'name email avatar' },
      { path: 'agent', select: 'name email phone avatar' }
    ]);
    
    return NextResponse.json({
      message: 'Inquiry sent successfully',
      inquiry
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Inquiry creation error:', error);
    
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

export const GET = requireAuth(getInquiries);
export const POST = requireAuth(createInquiry);
