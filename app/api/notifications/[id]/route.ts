import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware/auth';
import { AuthenticatedRequest } from '@/lib/types/auth';

// GET /api/notifications/[id] - Get specific notification
async function getNotification(
  request: AuthenticatedRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const userId = request.user?.userId;

    const notification = await prisma.notification.findFirst({
      where: {
        id,
        userId, // Ensure user can only access their own notifications
      },
    });

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ notification });
  } catch (error: any) {
    console.error('Get notification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/notifications/[id] - Update specific notification
async function updateNotification(
  request: AuthenticatedRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { isRead } = await request.json();
    const userId = request.user?.userId;

    // Check if notification exists and belongs to user
    const existingNotification = await prisma.notification.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingNotification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    const updateData: any = { isRead };
    if (isRead && !existingNotification.readAt) {
      updateData.readAt = new Date();
    }

    const notification = await prisma.notification.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      message: 'Notification updated successfully',
      notification,
    });
  } catch (error: any) {
    console.error('Update notification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/notifications/[id] - Delete specific notification
async function deleteNotification(
  request: AuthenticatedRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const userId = request.user?.userId;

    // Check if notification exists and belongs to user
    const existingNotification = await prisma.notification.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingNotification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    await prisma.notification.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Notification deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete notification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(getNotification);
export const PUT = requireAuth(updateNotification);
export const DELETE = requireAuth(deleteNotification);
