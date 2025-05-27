import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, AuthenticatedRequest } from '@/lib/middleware/auth';

// GET /api/favorites - Get user's favorite properties
async function getFavorites(request: AuthenticatedRequest) {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: request.user?.userId },
      include: {
        property: {
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
        }
      },
      orderBy: { createdAt: 'desc' }
    });

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
    const { propertyId } = await request.json();

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Create favorite (Prisma will handle unique constraint)
    try {
      const favorite = await prisma.favorite.create({
        data: {
          userId: request.user?.userId!,
          propertyId: propertyId
        }
      });

      return NextResponse.json({
        message: 'Property added to favorites',
        favorite
      }, { status: 201 });

    } catch (error: any) {
      // Handle unique constraint violation
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'Property already in favorites' },
          { status: 400 }
        );
      }
      throw error;
    }

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
