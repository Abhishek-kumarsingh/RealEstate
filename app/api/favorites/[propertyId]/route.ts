import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, AuthenticatedRequest } from '@/lib/middleware/auth';

// DELETE /api/favorites/[propertyId] - Remove property from favorites
async function removeFromFavorites(
  request: AuthenticatedRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 503 }
      );
    }

    const { propertyId } = await params;
    const deletedFavorite = await prisma.favorite.deleteMany({
      where: {
        userId: request.user?.userId,
        propertyId
      }
    });

    if (deletedFavorite.count === 0) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Property removed from favorites'
    }, { status: 200 });

  } catch (error: any) {
    console.error('Remove from favorites error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const DELETE = requireAuth(removeFromFavorites);
