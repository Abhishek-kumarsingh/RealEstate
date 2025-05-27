import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requireRole, AuthenticatedRequest } from '@/lib/middleware/auth';

// GET /api/properties/[id] - Get single property
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: params.id },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            bio: true
          }
        },
        images: true
      }
    });

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
    const property = await prisma.property.findUnique({
      where: { id: params.id },
      select: { id: true, agentId: true }
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Check permissions - agents can only update their own properties
    if (request.user?.role === 'AGENT' && property.agentId !== request.user.userId) {
      return NextResponse.json(
        { error: 'You can only update your own properties' },
        { status: 403 }
      );
    }

    const updateData = await request.json();

    // Prevent agents from changing the agent field
    if (request.user?.role === 'AGENT') {
      delete updateData.agentId;
    }

    // Convert enum values to uppercase
    if (updateData.type) updateData.type = updateData.type.toUpperCase();
    if (updateData.category) updateData.category = updateData.category.toUpperCase();
    if (updateData.status) updateData.status = updateData.status.toUpperCase();

    const updatedProperty = await prisma.property.update({
      where: { id: params.id },
      data: updateData,
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            bio: true
          }
        },
        images: true
      }
    });

    return NextResponse.json({
      message: 'Property updated successfully',
      property: updatedProperty
    }, { status: 200 });

  } catch (error: any) {
    console.error('Property update error:', error);

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
    const property = await prisma.property.findUnique({
      where: { id: params.id },
      select: { id: true, agentId: true }
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Check permissions - agents can only delete their own properties
    if (request.user?.role === 'AGENT' && property.agentId !== request.user.userId) {
      return NextResponse.json(
        { error: 'You can only delete your own properties' },
        { status: 403 }
      );
    }

    await prisma.property.delete({
      where: { id: params.id }
    });

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

export const PUT = requireRole(['AGENT', 'ADMIN'])(updateProperty);
export const DELETE = requireRole(['AGENT', 'ADMIN'])(deleteProperty);
