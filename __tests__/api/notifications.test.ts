import { NextRequest } from 'next/server';
import { GET as getNotifications, POST as createNotification } from '@/app/api/notifications/route';
import { prisma } from '@/lib/prisma';

// Mock Prisma
jest.mock('@/lib/prisma');
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

// Mock auth middleware
jest.mock('@/lib/middleware/auth', () => ({
  requireAuth: (handler: any) => handler,
}));

describe('/api/notifications', () => {
  const mockUser = {
    userId: 'user-1',
    email: 'test@example.com',
    role: 'USER',
    name: 'Test User',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/notifications', () => {
    it('should get user notifications successfully', async () => {
      const mockNotifications = [
        {
          id: 'notif-1',
          userId: 'user-1',
          type: 'INQUIRY_RECEIVED',
          title: 'New Inquiry',
          message: 'You have a new inquiry',
          isRead: false,
          createdAt: new Date(),
        },
        {
          id: 'notif-2',
          userId: 'user-1',
          type: 'PROPERTY_APPROVED',
          title: 'Property Approved',
          message: 'Your property has been approved',
          isRead: true,
          createdAt: new Date(),
        },
      ];

      mockPrisma.notification.findMany.mockResolvedValue(mockNotifications);
      mockPrisma.notification.count.mockResolvedValue(2);

      const request = new NextRequest('http://localhost:3000/api/notifications?page=1&limit=10');
      (request as any).user = mockUser;

      const response = await getNotifications(request as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(2);
      expect(data.pagination).toBeDefined();
      expect(data.pagination.total).toBe(2);
    });

    it('should filter unread notifications only', async () => {
      const mockUnreadNotifications = [
        {
          id: 'notif-1',
          userId: 'user-1',
          type: 'INQUIRY_RECEIVED',
          title: 'New Inquiry',
          message: 'You have a new inquiry',
          isRead: false,
          createdAt: new Date(),
        },
      ];

      mockPrisma.notification.findMany.mockResolvedValue(mockUnreadNotifications);
      mockPrisma.notification.count.mockResolvedValue(1);

      const request = new NextRequest('http://localhost:3000/api/notifications?unreadOnly=true');
      (request as any).user = mockUser;

      const response = await getNotifications(request as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(1);
      expect(data.data[0].isRead).toBe(false);
    });
  });

  describe('POST /api/notifications', () => {
    it('should create notification successfully for admin', async () => {
      const adminUser = { ...mockUser, role: 'ADMIN' };
      const mockNotification = {
        id: 'notif-1',
        userId: 'user-2',
        type: 'SYSTEM_MAINTENANCE',
        title: 'System Maintenance',
        message: 'Scheduled maintenance tonight',
        data: null,
        isRead: false,
        createdAt: new Date(),
      };

      mockPrisma.notification.create.mockResolvedValue(mockNotification);

      const request = new NextRequest('http://localhost:3000/api/notifications', {
        method: 'POST',
        body: JSON.stringify({
          userId: 'user-2',
          type: 'SYSTEM_MAINTENANCE',
          title: 'System Maintenance',
          message: 'Scheduled maintenance tonight',
        }),
      });
      (request as any).user = adminUser;

      const response = await createNotification(request as any);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.message).toBe('Notification created successfully');
      expect(data.notification.title).toBe('System Maintenance');
    });

    it('should allow user to create notification for themselves', async () => {
      const mockNotification = {
        id: 'notif-1',
        userId: 'user-1',
        type: 'PROPERTY_APPROVED',
        title: 'Property Approved',
        message: 'Your property has been approved',
        data: null,
        isRead: false,
        createdAt: new Date(),
      };

      mockPrisma.notification.create.mockResolvedValue(mockNotification);

      const request = new NextRequest('http://localhost:3000/api/notifications', {
        method: 'POST',
        body: JSON.stringify({
          userId: 'user-1',
          type: 'PROPERTY_APPROVED',
          title: 'Property Approved',
          message: 'Your property has been approved',
        }),
      });
      (request as any).user = mockUser;

      const response = await createNotification(request as any);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.notification.userId).toBe('user-1');
    });

    it('should fail when non-admin tries to create notification for another user', async () => {
      const request = new NextRequest('http://localhost:3000/api/notifications', {
        method: 'POST',
        body: JSON.stringify({
          userId: 'user-2', // Different user
          type: 'PROPERTY_APPROVED',
          title: 'Property Approved',
          message: 'Your property has been approved',
        }),
      });
      (request as any).user = mockUser;

      const response = await createNotification(request as any);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Unauthorized');
    });

    it('should fail with missing required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/notifications', {
        method: 'POST',
        body: JSON.stringify({
          userId: 'user-1',
          // Missing type, title, message
        }),
      });
      (request as any).user = mockUser;

      const response = await createNotification(request as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('User ID, type, title, and message are required');
    });
  });
});
