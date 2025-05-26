import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

async function getProfile(request: AuthenticatedRequest) {
  try {
    await connectDB();
    
    const user = await User.findById(request.user?.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      user: user.toJSON()
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function updateProfile(request: AuthenticatedRequest) {
  try {
    await connectDB();
    
    const { name, phone, bio, avatar } = await request.json();
    
    const user = await User.findById(request.user?.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Update fields if provided
    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (bio !== undefined) user.bio = bio.trim();
    if (avatar !== undefined) user.avatar = avatar.trim();
    
    await user.save();
    
    return NextResponse.json({
      message: 'Profile updated successfully',
      user: user.toJSON()
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Profile update error:', error);
    
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

export const GET = requireAuth(getProfile);
export const PUT = requireAuth(updateProfile);
