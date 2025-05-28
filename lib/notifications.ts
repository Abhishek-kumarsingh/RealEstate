import { prisma } from '@/lib/prisma';
import { NotificationType } from '@prisma/client';

export interface CreateNotificationData {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
}

export interface NotificationTemplates {
  INQUIRY_RECEIVED: (data: { propertyTitle: string; userName: string }) => {
    title: string;
    message: string;
  };
  INQUIRY_RESPONDED: (data: { propertyTitle: string; agentName: string }) => {
    title: string;
    message: string;
  };
  PROPERTY_APPROVED: (data: { propertyTitle: string }) => {
    title: string;
    message: string;
  };
  PROPERTY_REJECTED: (data: { propertyTitle: string; reason?: string }) => {
    title: string;
    message: string;
  };
  AGENT_VERIFIED: () => {
    title: string;
    message: string;
  };
  AGENT_REJECTED: (data: { reason?: string }) => {
    title: string;
    message: string;
  };
  PROPERTY_FEATURED: (data: { propertyTitle: string }) => {
    title: string;
    message: string;
  };
  SYSTEM_MAINTENANCE: (data: { scheduledTime: string }) => {
    title: string;
    message: string;
  };
}

// Notification templates
export const notificationTemplates: NotificationTemplates = {
  INQUIRY_RECEIVED: ({ propertyTitle, userName }) => ({
    title: 'New Property Inquiry',
    message: `${userName} has inquired about your property "${propertyTitle}". Please respond promptly.`,
  }),

  INQUIRY_RESPONDED: ({ propertyTitle, agentName }) => ({
    title: 'Inquiry Response Received',
    message: `${agentName} has responded to your inquiry about "${propertyTitle}".`,
  }),

  PROPERTY_APPROVED: ({ propertyTitle }) => ({
    title: 'Property Approved',
    message: `Your property "${propertyTitle}" has been approved and is now live on the platform.`,
  }),

  PROPERTY_REJECTED: ({ propertyTitle, reason }) => ({
    title: 'Property Rejected',
    message: `Your property "${propertyTitle}" has been rejected. ${reason ? `Reason: ${reason}` : 'Please contact support for more details.'}`,
  }),

  AGENT_VERIFIED: () => ({
    title: 'Agent Verification Complete',
    message: 'Congratulations! Your agent verification has been approved. You can now list properties directly.',
  }),

  AGENT_REJECTED: ({ reason }) => ({
    title: 'Agent Verification Rejected',
    message: `Your agent verification has been rejected. ${reason ? `Reason: ${reason}` : 'Please contact support for more details.'}`,
  }),

  PROPERTY_FEATURED: ({ propertyTitle }) => ({
    title: 'Property Featured',
    message: `Your property "${propertyTitle}" has been featured on the homepage!`,
  }),

  SYSTEM_MAINTENANCE: ({ scheduledTime }) => ({
    title: 'Scheduled Maintenance',
    message: `System maintenance is scheduled for ${scheduledTime}. The platform may be temporarily unavailable.`,
  }),
};

// Create a notification
export async function createNotification(data: CreateNotificationData) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data || null,
      },
    });

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

// Create notification using template
export async function createNotificationFromTemplate(
  userId: string,
  type: keyof NotificationTemplates,
  templateData: any,
  additionalData?: any
) {
  try {
    const template = notificationTemplates[type](templateData);
    
    return await createNotification({
      userId,
      type: type as NotificationType,
      title: template.title,
      message: template.message,
      data: additionalData,
    });
  } catch (error) {
    console.error('Error creating notification from template:', error);
    throw error;
  }
}

// Create bulk notifications
export async function createBulkNotifications(notifications: CreateNotificationData[]) {
  try {
    const result = await prisma.notification.createMany({
      data: notifications,
    });

    return result;
  } catch (error) {
    console.error('Error creating bulk notifications:', error);
    throw error;
  }
}

// Mark notifications as read
export async function markNotificationsAsRead(userId: string, notificationIds: string[]) {
  try {
    const result = await prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        userId,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return result;
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    throw error;
  }
}

// Get unread notification count
export async function getUnreadNotificationCount(userId: string) {
  try {
    const count = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return count;
  } catch (error) {
    console.error('Error getting unread notification count:', error);
    throw error;
  }
}

// Delete old notifications (cleanup utility)
export async function deleteOldNotifications(daysOld: number = 30) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await prisma.notification.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
        isRead: true,
      },
    });

    return result;
  } catch (error) {
    console.error('Error deleting old notifications:', error);
    throw error;
  }
}
