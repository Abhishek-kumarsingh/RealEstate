import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware/auth';
import { AuthenticatedRequest } from '@/lib/types/auth';
import { createNotificationFromTemplate } from '@/lib/notifications';
import { sendInquiryNotification } from '@/lib/email';

// GET /api/inquiries - Get user's inquiries
async function getInquiries(request: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = request.user?.role;

    let where: any = {};

    if (role === 'USER') {
      // Users see only their own inquiries
      where.userId = request.user?.userId;
    } else if (role === 'AGENT') {
      // Agents see inquiries for their properties
      where.agentId = request.user?.userId;
    }
    // Admins see all inquiries (no filter)

    const status = searchParams.get('status');
    if (status && ['PENDING', 'RESPONDED', 'CLOSED'].includes(status.toUpperCase())) {
      where.status = status.toUpperCase();
    }

    const inquiries = await prisma.inquiry.findMany({
      where,
      include: {
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            type: true,
            address: true,
            city: true,
            state: true,
            images: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      inquiries
    }, { status: 200 });

  } catch (error: any) {
    console.error('Inquiries fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/inquiries - Create new inquiry
async function createInquiry(request: AuthenticatedRequest) {
  try {
    const { propertyId, message, contactInfo } = await request.json();

    if (!propertyId || !message || !contactInfo) {
      return NextResponse.json(
        { error: 'Property ID, message, and contact info are required' },
        { status: 400 }
      );
    }

    // Check if property exists and get agent info
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: {
        id: true,
        agentId: true,
        title: true,
        agent: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Create inquiry
    const inquiry = await prisma.inquiry.create({
      data: {
        propertyId,
        userId: request.user?.userId!,
        agentId: property.agentId,
        message,
        contactInfo: {
          name: contactInfo.name,
          email: contactInfo.email,
          phone: contactInfo.phone || null
        },
        status: 'PENDING'
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            type: true,
            address: true,
            city: true,
            state: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true
          }
        }
      }
    });

    // Send notification to agent
    try {
      await createNotificationFromTemplate(
        property.agentId,
        'INQUIRY_RECEIVED',
        {
          propertyTitle: property.title,
          userName: contactInfo.name
        },
        {
          inquiryId: inquiry.id,
          propertyId: propertyId
        }
      );
    } catch (error) {
      console.error('Error creating notification:', error);
    }

    // Send email to agent
    try {
      await sendInquiryNotification({
        agentEmail: property.agent.email,
        agentName: property.agent.name,
        userName: contactInfo.name,
        userEmail: contactInfo.email,
        propertyTitle: property.title,
        message: message,
        propertyUrl: `${process.env.NEXTAUTH_URL}/properties/${propertyId}`
      });
    } catch (error) {
      console.error('Error sending email notification:', error);
    }

    return NextResponse.json({
      message: 'Inquiry sent successfully',
      inquiry
    }, { status: 201 });

  } catch (error: any) {
    console.error('Inquiry creation error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(getInquiries);
export const POST = requireAuth(createInquiry);
