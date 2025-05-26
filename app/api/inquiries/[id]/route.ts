import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Inquiry from '@/lib/models/Inquiry';
import { requireAuth, AuthenticatedRequest } from '@/lib/middleware/auth';

// PUT /api/inquiries/[id] - Update inquiry (respond to inquiry)
async function updateInquiry(
  request: AuthenticatedRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const inquiry = await Inquiry.findById(params.id);
    
    if (!inquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }
    
    // Check permissions - only the agent or admin can respond
    if (request.user?.role === 'agent' && inquiry.agent.toString() !== request.user.userId) {
      return NextResponse.json(
        { error: 'You can only respond to inquiries for your properties' },
        { status: 403 }
      );
    }
    
    if (request.user?.role === 'user') {
      return NextResponse.json(
        { error: 'Users cannot update inquiries' },
        { status: 403 }
      );
    }
    
    const { response, status } = await request.json();
    
    if (response) {
      inquiry.response = response;
      inquiry.status = 'responded';
      inquiry.respondedAt = new Date();
    }
    
    if (status && ['pending', 'responded', 'closed'].includes(status)) {
      inquiry.status = status;
    }
    
    await inquiry.save();
    
    // Populate related data
    await inquiry.populate([
      { path: 'property', select: 'title price type location' },
      { path: 'user', select: 'name email avatar' },
      { path: 'agent', select: 'name email phone avatar' }
    ]);
    
    return NextResponse.json({
      message: 'Inquiry updated successfully',
      inquiry
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Inquiry update error:', error);
    
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

export const PUT = requireAuth(updateInquiry);
