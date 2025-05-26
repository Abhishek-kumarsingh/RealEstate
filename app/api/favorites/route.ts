import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Favorite from '@/lib/models/Favorite';
import Property from '@/lib/models/Property';
import { requireAuth, AuthenticatedRequest } from '@/lib/middleware/auth';

// GET /api/favorites - Get user's favorite properties
async function getFavorites(request: AuthenticatedRequest) {
  try {
    await connectDB();
    
    const favorites = await Favorite.find({ user: request.user?.userId })
      .populate({
        path: 'property',
        populate: {
          path: 'agent',
          select: 'name email phone avatar'
        }
      })
      .sort({ createdAt: -1 });
    
    const properties = favorites.map(fav => fav.property).filter(Boolean);
    
    return NextResponse.json({
      favorites: properties
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Favorites fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/favorites - Add property to favorites
async function addToFavorites(request: AuthenticatedRequest) {
  try {
    await connectDB();
    
    const { propertyId } = await request.json();
    
    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
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
    
    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      user: request.user?.userId,
      property: propertyId
    });
    
    if (existingFavorite) {
      return NextResponse.json(
        { error: 'Property already in favorites' },
        { status: 400 }
      );
    }
    
    // Create favorite
    const favorite = new Favorite({
      user: request.user?.userId,
      property: propertyId
    });
    
    await favorite.save();
    
    return NextResponse.json({
      message: 'Property added to favorites',
      favorite
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Add to favorites error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(getFavorites);
export const POST = requireAuth(addToFavorites);
