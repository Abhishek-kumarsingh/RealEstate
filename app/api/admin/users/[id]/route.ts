import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/middleware/auth';
import { AuthenticatedRequest } from '@/lib/types/auth';



// GET /api/admin/users/[id] - Get single user (Admin only)
async function getUser(
  request: AuthenticatedRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        phone: true,
        bio: true,
        isVerified: true,
        isActive: true,
        verificationStatus: true,
        kycStatus: true,
        licenseNumber: true,
        agencyName: true,
        experienceYears: true,
        specializations: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        country: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        _count: {
          select: {
            properties: true,
            inquiries: true,
            favorites: true,
            reviews: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/users/[id] - Update user (Admin only)
async function updateUser(
  request: AuthenticatedRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updateData = await request.json();

    // Remove sensitive fields that shouldn't be updated directly
    const {
      password,
      createdAt,
      updatedAt,
      lastLoginAt,
      ...safeUpdateData
    } = updateData;

    // Convert role to uppercase if provided
    if (safeUpdateData.role) {
      safeUpdateData.role = safeUpdateData.role.toUpperCase();
    }

    // Convert verification status to uppercase if provided
    if (safeUpdateData.verificationStatus) {
      safeUpdateData.verificationStatus = safeUpdateData.verificationStatus.toUpperCase();
    }

    const user = await prisma.user.update({
      where: { id },
      data: safeUpdateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        phone: true,
        isVerified: true,
        isActive: true,
        verificationStatus: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: 'User updated successfully',
      user,
    });
  } catch (error: any) {
    console.error('Update user error:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] - Delete user (Admin only)
async function deleteUser(
  request: AuthenticatedRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent deletion of admin users (optional safety check)
    if (user.role === 'ADMIN') {
      return NextResponse.json(
        { error: 'Cannot delete admin users' },
        { status: 403 }
      );
    }

    // Delete user and related data in a transaction
    await prisma.$transaction(async (tx: any) => {
      // Delete related records first
      await tx.favorite.deleteMany({ where: { userId: id } });
      await tx.inquiry.deleteMany({ where: { userId: id } });
      await tx.propertyView.deleteMany({ where: { userId: id } });
      await tx.searchHistory.deleteMany({ where: { userId: id } });
      await tx.notification.deleteMany({ where: { userId: id } });
      await tx.document.deleteMany({ where: { uploadedById: id } });
      await tx.userSession.deleteMany({ where: { userId: id } });

      // Delete properties owned by this agent
      await tx.property.deleteMany({
        where: { agentId: id },
      });

      // Delete the user
      await tx.user.delete({ where: { id } });
    });

    return NextResponse.json({
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireRole(['ADMIN'])(getUser);
export const PUT = requireRole(['ADMIN'])(updateUser);
export const DELETE = requireRole(['ADMIN'])(deleteUser);
