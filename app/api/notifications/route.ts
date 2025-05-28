import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware/auth';
import { AuthenticatedRequest } from '@/lib/types/auth';
import { paginate } from '@/lib/db-utils';

// GET /api/notifications - Get user notifications
async function getNotifications(request: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    const userId = request.user?.userId;

    const where: any = { userId };
    if (unreadOnly) {
      where.isRead = false;
    }

    const result = await paginate(prisma.notification, {
      page,
      limit,
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Get notifications error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/notifications - Create notification (Admin/System only)
async function createNotification(request: AuthenticatedRequest) {
  try {
    const { userId, type, title, message, data } = await request.json();

    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { error: 'User ID, type, title, and message are required' },
        { status: 400 }
      );
    }

    // Only admins can create notifications for other users
    if (request.user?.role !== 'ADMIN' && request.user?.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        data: data || null,
      },
    });

    return NextResponse.json({
      message: 'Notification created successfully',
      notification,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create notification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/notifications - Mark notifications as read
async function updateNotifications(request: AuthenticatedRequest) {
  try {
    const { notificationIds, markAsRead = true } = await request.json();
    const userId = request.user?.userId;

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return NextResponse.json(
        { error: 'Notification IDs array is required' },
        { status: 400 }
      );
    }

    const updateData: any = {
      isRead: markAsRead,
    };

    if (markAsRead) {
      updateData.readAt = new Date();
    }

    const updatedNotifications = await prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        userId, // Ensure user can only update their own notifications
      },
      data: updateData,
    });

    return NextResponse.json({
      message: `${updatedNotifications.count} notifications updated`,
      count: updatedNotifications.count,
    });
  } catch (error: any) {
    console.error('Update notifications error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(getNotifications);
export const POST = requireAuth(createNotification);
export const PUT = requireAuth(updateNotifications);
